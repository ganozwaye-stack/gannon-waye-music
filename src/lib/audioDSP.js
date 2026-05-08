/**
 * Real browser-side audio DSP mastering engine
 * Uses Web Audio API to apply actual signal processing to audio buffers.
 * This is genuine DSP — not a simulation label — but runs in-browser without FFmpeg.
 *
 * Processing chain per profile:
 *   1. Gain staging (normalise to headroom target)
 *   2. EQ curves (low shelf, high shelf, presence boost)
 *   3. Stereo width (mid/side processing)
 *   4. Soft-knee limiter (peak ceiling)
 *   5. Re-encode to WAV (16-bit PCM)
 */

// Profile presets — define the DSP parameters for each mastering style
const PROFILE_DSP = {
  streaming_master: {
    targetLUFS: -14,       // Spotify/Apple Music target
    limitCeiling: -1.0,
    lowShelfGain: 1.5,     // slight low end warmth
    highShelfGain: 2.0,    // air and presence
    presenceGain: 1.0,
    stereoWidthMult: 1.0,
    saturation: 0.02,
  },
  loud_club: {
    targetLUFS: -8,
    limitCeiling: -0.3,
    lowShelfGain: 4.0,
    highShelfGain: 2.5,
    presenceGain: 2.0,
    stereoWidthMult: 1.2,
    saturation: 0.06,
  },
  warm_analog: {
    targetLUFS: -16,
    limitCeiling: -1.5,
    lowShelfGain: 3.0,
    highShelfGain: -1.0,
    presenceGain: 0.5,
    stereoWidthMult: 0.9,
    saturation: 0.12,      // harmonic saturation
  },
  vocal_forward: {
    targetLUFS: -14,
    limitCeiling: -1.0,
    lowShelfGain: 0.5,
    highShelfGain: 3.0,
    presenceGain: 4.0,     // boost 3-5kHz presence
    stereoWidthMult: 0.85, // tighter stereo to push vocal centre
    saturation: 0.03,
  },
  cinematic: {
    targetLUFS: -18,
    limitCeiling: -2.0,
    lowShelfGain: 2.0,
    highShelfGain: 1.5,
    presenceGain: 0.5,
    stereoWidthMult: 1.4,  // wide stereo field
    saturation: 0.01,
  },
  acoustic: {
    targetLUFS: -16,
    limitCeiling: -1.5,
    lowShelfGain: 0.0,
    highShelfGain: 1.0,
    presenceGain: 1.5,
    stereoWidthMult: 1.0,
    saturation: 0.0,
  },
  aggressive_modern: {
    targetLUFS: -7,
    limitCeiling: -0.1,
    lowShelfGain: 5.0,
    highShelfGain: 4.0,
    presenceGain: 3.0,
    stereoWidthMult: 1.1,
    saturation: 0.10,
  },
};

/** Apply harmonic saturation (soft clip / tape emulation) */
function saturate(sample, amount) {
  if (amount === 0) return sample;
  return sample - amount * sample * sample * sample;
}

/** Low-shelf EQ applied sample-by-sample (first-order IIR) */
function createLowShelf(sampleRate, freq, gainDB) {
  const A = Math.pow(10, gainDB / 40);
  const w0 = 2 * Math.PI * freq / sampleRate;
  const cosW0 = Math.cos(w0);
  const S = 1;
  const alpha = Math.sin(w0) / 2 * Math.sqrt((A + 1/A) * (1/S - 1) + 2);
  const b0 =    A * ((A+1) - (A-1)*cosW0 + 2*Math.sqrt(A)*alpha);
  const b1 =  2*A * ((A-1) - (A+1)*cosW0);
  const b2 =    A * ((A+1) - (A-1)*cosW0 - 2*Math.sqrt(A)*alpha);
  const a0 =        (A+1) + (A-1)*cosW0 + 2*Math.sqrt(A)*alpha;
  const a1 =   -2 * ((A-1) + (A+1)*cosW0);
  const a2 =        (A+1) + (A-1)*cosW0 - 2*Math.sqrt(A)*alpha;
  return { b: [b0/a0, b1/a0, b2/a0], a: [1, a1/a0, a2/a0] };
}

/** High-shelf EQ (first-order IIR) */
function createHighShelf(sampleRate, freq, gainDB) {
  const A = Math.pow(10, gainDB / 40);
  const w0 = 2 * Math.PI * freq / sampleRate;
  const cosW0 = Math.cos(w0);
  const S = 1;
  const alpha = Math.sin(w0) / 2 * Math.sqrt((A + 1/A) * (1/S - 1) + 2);
  const b0 =    A * ((A+1) + (A-1)*cosW0 + 2*Math.sqrt(A)*alpha);
  const b1 = -2*A * ((A-1) + (A+1)*cosW0);
  const b2 =    A * ((A+1) + (A-1)*cosW0 - 2*Math.sqrt(A)*alpha);
  const a0 =        (A+1) - (A-1)*cosW0 + 2*Math.sqrt(A)*alpha;
  const a1 =    2 * ((A-1) - (A+1)*cosW0);
  const a2 =        (A+1) - (A-1)*cosW0 - 2*Math.sqrt(A)*alpha;
  return { b: [b0/a0, b1/a0, b2/a0], a: [1, a1/a0, a2/a0] };
}

/** Peaking EQ for presence boost */
function createPeaking(sampleRate, freq, gainDB, Q) {
  const A = Math.pow(10, gainDB / 40);
  const w0 = 2 * Math.PI * freq / sampleRate;
  const alpha = Math.sin(w0) / (2 * Q);
  const b0 =   1 + alpha * A;
  const b1 =  -2 * Math.cos(w0);
  const b2 =   1 - alpha * A;
  const a0 =   1 + alpha / A;
  const a1 =  -2 * Math.cos(w0);
  const a2 =   1 - alpha / A;
  return { b: [b0/a0, b1/a0, b2/a0], a: [1, a1/a0, a2/a0] };
}

/** Apply a biquad IIR filter to a channel buffer */
function applyBiquad(data, filter) {
  const { b, a } = filter;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < data.length; i++) {
    const x0 = data[i];
    const y0 = b[0]*x0 + b[1]*x1 + b[2]*x2 - a[1]*y1 - a[2]*y2;
    data[i] = y0;
    x2 = x1; x1 = x0;
    y2 = y1; y1 = y0;
  }
}

/** Soft-knee peak limiter */
function applyLimiter(channels, ceilingDB, kneeDB = 3) {
  const ceiling = Math.pow(10, ceilingDB / 20);
  const knee = Math.pow(10, (ceilingDB - kneeDB) / 20);
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      const abs = Math.abs(ch[i]);
      if (abs > knee) {
        const excess = abs - knee;
        const range = ceiling - knee;
        const gain = (knee + range * Math.tanh(excess / range)) / abs;
        ch[i] *= gain;
      }
    }
  }
}

/** Stereo width via mid/side processing */
function applyStereoWidth(left, right, widthMult) {
  if (left.length !== right.length) return;
  for (let i = 0; i < left.length; i++) {
    const mid = (left[i] + right[i]) * 0.5;
    const side = (left[i] - right[i]) * 0.5 * widthMult;
    left[i] = mid + side;
    right[i] = mid - side;
  }
}

/** RMS loudness calculation (approximation of integrated LUFS) */
function calcRMS(channels) {
  let sum = 0, count = 0;
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      sum += ch[i] * ch[i];
      count++;
    }
  }
  return Math.sqrt(sum / count);
}

/** Encode Float32 PCM channels to 16-bit WAV Blob */
function encodeWAV(channels, sampleRate) {
  const numChannels = channels.length;
  const numSamples = channels[0].length;
  const bitsPerSample = 16;
  const blockAlign = numChannels * bitsPerSample / 8;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const write = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  write(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  write(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const s = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Main mastering function.
 * @param {File} file - The original audio file
 * @param {string} profileName - One of the PROFILE_DSP keys
 * @param {object} controls - { loudness, stereo_width, warmth, brightness, punch, vocal_presence, limiter_intensity } (0–100)
 * @param {function} onProgress - callback(0–100)
 * @returns {Promise<{blob: Blob, filename: string, stats: object}>}
 */
export async function masterTrack(file, profileName, controls, onProgress) {
  onProgress?.(5);

  const profile = PROFILE_DSP[profileName] || PROFILE_DSP.streaming_master;

  // Decode audio
  const arrayBuffer = await file.arrayBuffer();
  const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  ctx.close();

  onProgress?.(20);

  const sampleRate = audioBuffer.sampleRate;
  const numChannels = Math.min(audioBuffer.numberOfChannels, 2);

  // Extract channels as mutable Float32Arrays
  const channels = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(new Float32Array(audioBuffer.getChannelData(c)));
  }

  // Fill mono to stereo if needed
  if (channels.length === 1) {
    channels.push(new Float32Array(channels[0]));
  }

  onProgress?.(30);

  // Map controls (0–100) to DSP scale factors
  const warmthFactor   = (controls.warmth - 50) / 50;        // -1 to +1
  const brightFactor   = (controls.brightness - 50) / 50;
  const presenceFactor = (controls.vocal_presence - 50) / 50;
  const widthFactor    = controls.stereo_width / 100;         // 0–1
  const limitFactor    = controls.limiter_intensity / 100;    // 0–1

  // EQ gains adjusted by controls
  const lowGainDB  = profile.lowShelfGain  + warmthFactor * 3;
  const highGainDB = profile.highShelfGain + brightFactor * 3;
  const presGainDB = profile.presenceGain  + presenceFactor * 4;

  // Build filters
  const lowShelf  = createLowShelf(sampleRate, 120, lowGainDB);
  const highShelf = createHighShelf(sampleRate, 10000, highGainDB);
  const presence  = createPeaking(sampleRate, 3500, presGainDB, 1.2);

  onProgress?.(40);

  // Apply EQ + saturation to each channel
  for (const ch of channels) {
    applyBiquad(ch, lowShelf);
    applyBiquad(ch, highShelf);
    applyBiquad(ch, presence);

    const sat = profile.saturation * (controls.punch / 100);
    if (sat > 0) {
      for (let i = 0; i < ch.length; i++) {
        ch[i] = saturate(ch[i], sat);
      }
    }
  }

  onProgress?.(60);

  // Stereo width (only if stereo)
  const stereoMult = profile.stereoWidthMult * (0.5 + widthFactor);
  applyStereoWidth(channels[0], channels[1], stereoMult);

  onProgress?.(70);

  // Loudness normalisation — gain to target RMS
  const currentRMS = calcRMS(channels);
  const targetRMS = Math.pow(10, (profile.targetLUFS + 3) / 20); // rough LUFS → RMS
  const loudnessGain = (currentRMS > 0) ? (targetRMS / currentRMS) : 1;
  const userGainMod  = 0.5 + (controls.loudness / 100);          // 0.5–1.5 user adjustment
  const finalGain    = loudnessGain * userGainMod;

  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      ch[i] *= finalGain;
    }
  }

  onProgress?.(80);

  // Limiter — ceiling adjusted by limiter_intensity control
  const ceilingDB = profile.limitCeiling - (1 - limitFactor) * 2; // tighter or looser ceiling
  applyLimiter(channels, ceilingDB);

  onProgress?.(90);

  // Measure output
  const outRMS = calcRMS(channels);
  const outLUFS = outRMS > 0 ? Math.round(20 * Math.log10(outRMS) - 3) : -60;
  let outPeak = 0;
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      if (Math.abs(ch[i]) > outPeak) outPeak = Math.abs(ch[i]);
    }
  }
  const outPeakDB = Math.round(20 * Math.log10(outPeak) * 10) / 10;

  // Encode to WAV
  const blob = encodeWAV(channels, sampleRate);
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const filename = `${baseName}_mastered_${profileName}.wav`;

  onProgress?.(100);

  return {
    blob,
    filename,
    stats: {
      output_lufs: outLUFS,
      output_peak_db: outPeakDB,
      profile: profileName,
      sample_rate: sampleRate,
      channels: numChannels,
    },
  };
}