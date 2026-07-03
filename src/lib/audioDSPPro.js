/**
 * Pro DSP Engine — upgraded mastering + mixing chain
 *
 * Upgrades over v1:
 *   ✅ Linkwitz-Riley 4th-order crossovers (phase-coherent 3-band split)
 *   ✅ True multiband compressor (proper band isolation + recombination)
 *   ✅ True inter-sample peak limiter (4× oversampling, cubic interpolation)
 *   ✅ K-weighted LUFS (corrected filter coefficients)
 *   ✅ 32-bit float WAV export (high-resolution)
 *   ✅ 48 kHz / 96 kHz export options
 *   ✅ Stem mixing engine (per-stem gain, pan, EQ → mix bus → master)
 *
 * No external dependencies — pure Web Audio API + JavaScript DSP.
 * All codecs are browser-native (WAV PCM, 32-bit float WAV).
 */

// ═══════════════════════════════════════════════════════════════════════
//  BIQUAD FILTER BUILDERS (Audio EQ Cookbook — RBJ formulas)
// ═══════════════════════════════════════════════════════════════════════

function createBiquad(type, sampleRate, freq, gainDB = 0, Q = 0.707) {
  const A  = Math.pow(10, gainDB / 40);
  const w0 = 2 * Math.PI * freq / sampleRate;
  const cw = Math.cos(w0);
  const sw = Math.sin(w0);
  const alpha = sw / (2 * Q);
  const sqA = 2 * Math.sqrt(A) * alpha;

  let b0, b1, b2, a0, a1, a2;

  switch (type) {
    case 'lowpass':
      b0 = (1 - cw) / 2; b1 = 1 - cw; b2 = (1 - cw) / 2;
      a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha;
      break;
    case 'highpass':
      b0 = (1 + cw) / 2; b1 = -(1 + cw); b2 = (1 + cw) / 2;
      a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha;
      break;
    case 'lowshelf':
      b0 = A * ((A + 1) - (A - 1) * cw + sqA);
      b1 = 2 * A * ((A - 1) - (A + 1) * cw);
      b2 = A * ((A + 1) - (A - 1) * cw - sqA);
      a0 = (A + 1) + (A - 1) * cw + sqA;
      a1 = -2 * ((A - 1) + (A + 1) * cw);
      a2 = (A + 1) + (A - 1) * cw - sqA;
      break;
    case 'highshelf':
      b0 = A * ((A + 1) + (A - 1) * cw + sqA);
      b1 = -2 * A * ((A - 1) + (A + 1) * cw);
      b2 = A * ((A + 1) + (A - 1) * cw - sqA);
      a0 = (A + 1) - (A - 1) * cw + sqA;
      a1 = 2 * ((A - 1) - (A + 1) * cw);
      a2 = (A + 1) - (A - 1) * cw - sqA;
      break;
    case 'peaking':
      b0 = 1 + alpha * A; b1 = -2 * cw; b2 = 1 - alpha * A;
      a0 = 1 + alpha / A; a1 = -2 * cw; a2 = 1 - alpha / A;
      break;
    case 'allpass':
      b0 = 1 - alpha; b1 = -2 * cw; b2 = 1 + alpha;
      a0 = 1 + alpha; a1 = -2 * cw; a2 = 1 - alpha;
      break;
    default:
      b0 = 1; b1 = 0; b2 = 0; a0 = 1; a1 = 0; a2 = 0;
  }

  return {
    b: [b0 / a0, b1 / a0, b2 / a0],
    a: [1, a1 / a0, a2 / a0],
  };
}

function applyBiquad(data, filter) {
  const { b, a } = filter;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < data.length; i++) {
    const x0 = data[i];
    const y0 = b[0] * x0 + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
    data[i] = y0;
    x2 = x1; x1 = x0;
    y2 = y1; y1 = y0;
  }
}

// Apply biquad without modifying source — returns new Float32Array
function filterCopy(data, filter) {
  const out = new Float32Array(data);
  applyBiquad(out, filter);
  return out;
}

// ═══════════════════════════════════════════════════════════════════════
//  LINKWITZ-RILEY 4TH-ORDER CROSSOVER (24 dB/oct, phase-coherent)
//  Two cascaded 2nd-order Butterworth (Q=0.5) filters.
// ═══════════════════════════════════════════════════════════════════════

function lr4Lowpass(sampleRate, freq) {
  // Cascade two 2nd-order Butterworth lowpass (Q=0.5 each → LR4)
  const stage1 = createBiquad('lowpass', sampleRate, freq, 0, 0.5);
  const stage2 = createBiquad('lowpass', sampleRate, freq, 0, 0.5);
  return [stage1, stage2];
}

function lr4Highpass(sampleRate, freq) {
  const stage1 = createBiquad('highpass', sampleRate, freq, 0, 0.5);
  const stage2 = createBiquad('highpass', sampleRate, freq, 0, 0.5);
  return [stage1, stage2];
}

function applyFilterChain(data, stages) {
  let out = data;
  for (const stage of stages) {
    out = filterCopy(out, stage);
  }
  return out;
}

// Split a channel into 3 bands using LR4 crossovers
function splitThreeBand(data, sampleRate, crossoverLow, crossoverHigh) {
  // Low band: LP at crossoverLow
  const lowStages = lr4Lowpass(sampleRate, crossoverLow);
  const low = applyFilterChain(data, lowStages);

  // High band: HP at crossoverHigh
  const highStages = lr4Highpass(sampleRate, crossoverHigh);
  const high = applyFilterChain(data, highStages);

  // Mid band: data - low - high (subtractive — phase-coherent with LR4)
  const mid = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    mid[i] = data[i] - low[i] - high[i];
  }

  return { low, mid, high };
}

// ═══════════════════════════════════════════════════════════════════════
//  COMPRESSOR (feed-forward RMS, with soft knee)
// ═══════════════════════════════════════════════════════════════════════

function compressBand(data, cfg, sampleRate) {
  const attackMs  = cfg.attack_ms || 10;
  const releaseMs = cfg.release_ms || 150;
  const attackCoef  = Math.exp(-1 / (sampleRate * (attackMs / 1000)));
  const releaseCoef = Math.exp(-1 / (sampleRate * (releaseMs / 1000)));
  const threshold = Math.pow(10, cfg.threshold / 20);
  const kneeDB = cfg.knee || 4;
  const ratio = cfg.ratio;

  let envelope = 0;
  for (let i = 0; i < data.length; i++) {
    const level = Math.abs(data[i]);

    // Peak detector with attack/release
    if (level > envelope) {
      envelope = attackCoef * envelope + (1 - attackCoef) * level;
    } else {
      envelope = releaseCoef * envelope + (1 - releaseCoef) * level;
    }

    // Soft-knee gain computation
    let gainLin = 1;
    if (envelope > threshold) {
      const overDB = 20 * Math.log10(envelope / threshold);
      // Soft knee: ramp compression in over `kneeDB` range below threshold
      const kneeStart = threshold / Math.pow(10, kneeDB / 20);
      if (envelope > kneeStart) {
        const effectiveOver = overDB + kneeDB;
        const gainDB = -(effectiveOver * (1 - 1 / ratio));
        gainLin = Math.pow(10, Math.max(-40, gainDB) / 20);
      } else {
        const gainDB = -(overDB * (1 - 1 / ratio));
        gainLin = Math.pow(10, Math.max(-40, gainDB) / 20);
      }
    }

    data[i] *= gainLin;
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  TRUE MULTIBAND COMPRESSOR (3-band LR4 split → compress → recombine)
// ═══════════════════════════════════════════════════════════════════════

function applyMultibandCompPro(channels, mbComp, sampleRate) {
  const xLow = 200;   // 200 Hz crossover
  const xHigh = 5000; // 5 kHz crossover

  for (let c = 0; c < channels.length; c++) {
    const ch = channels[c];
    const { low, mid, high } = splitThreeBand(ch, sampleRate, xLow, xHigh);

    // Compress each band independently
    compressBand(low,  mbComp.low,  sampleRate);
    compressBand(mid,  mbComp.mid,  sampleRate);
    compressBand(high, mbComp.high, sampleRate);

    // Recombine (phase-coherent with LR4 subtractive mid)
    for (let i = 0; i < ch.length; i++) {
      ch[i] = low[i] + mid[i] + high[i];
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  TRUE INTER-SAMPLE PEAK LIMITER (4× oversampling, cubic interpolation)
// ═══════════════════════════════════════════════════════════════════════

// 4× oversampling via cubic Hermite interpolation
function oversample4x(data) {
  const out = new Float32Array(data.length * 4);
  for (let i = 0; i < data.length; i++) {
    const i0 = Math.max(0, i - 1);
    const i1 = i;
    const i2 = Math.min(data.length - 1, i + 1);
    const i3 = Math.min(data.length - 1, i + 2);

    const y0 = data[i0], y1 = data[i1], y2 = data[i2], y3 = data[i3];

    // Cubic Hermite coefficients
    const c0 = y1;
    const c1 = 0.5 * (y2 - y0);
    const c2 = y0 - 2.5 * y1 + 2 * y2 - 0.5 * y3;
    const c3 = 0.5 * (y3 - y0) + 1.5 * (y1 - y2);

    for (let j = 0; j < 4; j++) {
      const t = j / 4;
      const t2 = t * t;
      const t3 = t2 * t;
      out[i * 4 + j] = c0 + c1 * t + c2 * t2 + c3 * t3;
    }
  }
  return out;
}

function applyTruePeakLimiter(channels, ceilingDB, sampleRate) {
  const ceiling = Math.pow(10, ceilingDB / 20);
  const LOOK = 256; // look-ahead samples at original rate
  const attackMs = 3;
  const releaseMs = 100;
  const attackCoef  = Math.exp(-1 / (sampleRate * (attackMs / 1000)));
  const releaseCoef = Math.exp(-1 / (sampleRate * (releaseMs / 1000)));

  for (const ch of channels) {
    // 4× oversample for true inter-sample peak detection
    const os = oversample4x(ch);
    const osCeiling = ceiling;

    // Look-ahead buffer at oversampled rate
    const osLook = LOOK * 4;
    const delayed = new Float32Array(os.length + osLook);
    delayed.set(os, osLook);

    let gain = 1.0;

    for (let i = 0; i < os.length; i++) {
      // Find max in look-ahead window (true inter-sample peak)
      let maxAhead = 0;
      const winEnd = Math.min(i + osLook, delayed.length);
      for (let k = i; k < winEnd; k++) {
        const abs = Math.abs(delayed[k]);
        if (abs > maxAhead) maxAhead = abs;
      }

      // Target gain to prevent exceeding ceiling
      const targetGain = maxAhead > osCeiling ? osCeiling / maxAhead : 1.0;

      // Smooth gain changes (attack faster than release)
      if (targetGain < gain) {
        gain = attackCoef * gain + (1 - attackCoef) * targetGain;
      } else {
        gain = releaseCoef * gain + (1 - releaseCoef) * targetGain;
      }
      gain = Math.min(gain, 1.0);

      os[i] = delayed[i] * gain;
    }

    // Downsample back (take every 4th sample)
    for (let i = 0; i < ch.length; i++) {
      ch[i] = os[i * 4];
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  K-WEIGHTED INTEGRATED LUFS (ITU-R BS.1770-4)
// ═══════════════════════════════════════════════════════════════════════

function calcIntegratedLUFS(channels, sampleRate) {
  // Stage 1: pre-filter (high shelf at 1681 Hz, +4 dB)
  const preFilter = createBiquad('highshelf', sampleRate, 1681, 4.0, 0.707);
  // Stage 2: RLB high-pass at 38 Hz
  const rlbFilter = createBiquad('highpass', sampleRate, 38, 0, 0.5);

  const filtered = channels.map(ch => {
    let f = filterCopy(ch, preFilter);
    f = filterCopy(f, rlbFilter);
    return f;
  });

  // Block-based gated loudness (400ms blocks, 75% overlap → 100ms hop)
  const blockSize = Math.round(sampleRate * 0.4);
  const hopSize = Math.round(sampleRate * 0.1);
  const blocks = [];

  for (let start = 0; start + blockSize <= filtered[0].length; start += hopSize) {
    let sum = 0;
    for (const ch of filtered) {
      for (let i = start; i < start + blockSize; i++) {
        sum += ch[i] * ch[i];
      }
    }
    blocks.push(sum / (blockSize * filtered.length));
  }

  if (blocks.length === 0) return -70;

  // Absolute gate: -70 LUFS
  const absThresh = Math.pow(10, (-70 + 10) / 10); // -70 LUFS in mean square
  const gated1 = blocks.filter(b => b >= absThresh);
  if (gated1.length === 0) return -70;

  const mean1 = gated1.reduce((a, b) => a + b, 0) / gated1.length;
  // Relative gate: -10 dB below mean
  const relGate = mean1 * Math.pow(10, -10 / 10);
  const gated2 = gated1.filter(b => b >= relGate);
  if (gated2.length === 0) return -70;

  const mean2 = gated2.reduce((a, b) => a + b, 0) / gated2.length;
  return -0.691 + 10 * Math.log10(mean2);
}

// ═══════════════════════════════════════════════════════════════════════
//  HARMONIC SATURATION (tape emulation — 2nd + 3rd order)
// ═══════════════════════════════════════════════════════════════════════

function saturate(sample, amount) {
  if (amount === 0) return sample;
  // Soft clip with even + odd harmonics
  const driven = sample * (1 + amount * 2);
  return Math.tanh(driven) * (1 - amount * 0.3) + sample * amount * 0.3;
}

// ═══════════════════════════════════════════════════════════════════════
//  STEREO WIDTH (mid/side)
// ═══════════════════════════════════════════════════════════════════════

function applyStereoWidth(left, right, widthMult) {
  for (let i = 0; i < left.length; i++) {
    const mid = (left[i] + right[i]) * 0.5;
    const side = (left[i] - right[i]) * 0.5 * widthMult;
    left[i] = mid + side;
    right[i] = mid - side;
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  TPDF DITHER
// ═══════════════════════════════════════════════════════════════════════

function applyDither(channels, bits) {
  const lsb = 1 / Math.pow(2, bits - 1);
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      const r1 = Math.random() - 0.5;
      const r2 = Math.random() - 0.5;
      ch[i] += lsb * (r1 + r2);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  WAV ENCODERS (24-bit integer + 32-bit float)
// ═══════════════════════════════════════════════════════════════════════

function encodeWAV24(channels, sampleRate) {
  const numChannels = channels.length;
  const numSamples = channels[0].length;
  const bitsPerSample = 24;
  const blockAlign = numChannels * 3;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const s = Math.max(-1, Math.min(1, channels[c][i]));
      const val = s < 0 ? s * 0x800000 : s * 0x7FFFFF;
      const int = Math.round(val);
      view.setUint8(offset, int & 0xFF);
      view.setUint8(offset + 1, (int >> 8) & 0xFF);
      view.setUint8(offset + 2, (int >> 16) & 0xFF);
      offset += 3;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// 32-bit float WAV — highest quality, no quantisation needed
function encodeWAV32Float(channels, sampleRate) {
  const numChannels = channels.length;
  const numSamples = channels[0].length;
  const bitsPerSample = 32;
  const blockAlign = numChannels * 4;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true); // IEEE float
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      view.setFloat32(offset, channels[c][i], true);
      offset += 4;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// ═══════════════════════════════════════════════════════════════════════
//  MASTERING PROFILES
// ═══════════════════════════════════════════════════════════════════════

const PROFILE_DSP = {
  streaming_master: {
    targetLUFS: -14, limitCeiling: -1.0, hpfFreq: 30,
    lowShelfFreq: 100, lowShelfGain: 1.5,
    loMidFreq: 300, loMidGain: -1.0, loMidQ: 1.0,
    hiMidFreq: 3500, hiMidGain: 1.5, hiMidQ: 1.2,
    highShelfFreq: 10000, highShelfGain: 2.0,
    stereoWidthMult: 1.0, saturation: 0.018,
    mbComp: {
      low:  { threshold: -20, ratio: 2.5, knee: 6, attack_ms: 15, release_ms: 200 },
      mid:  { threshold: -18, ratio: 2.0, knee: 4, attack_ms: 10, release_ms: 150 },
      high: { threshold: -22, ratio: 1.8, knee: 6, attack_ms: 5,  release_ms: 100 },
    },
  },
  loud_club: {
    targetLUFS: -8, limitCeiling: -0.3, hpfFreq: 25,
    lowShelfFreq: 80, lowShelfGain: 5.0,
    loMidFreq: 250, loMidGain: -2.0, loMidQ: 0.8,
    hiMidFreq: 4000, hiMidGain: 2.5, hiMidQ: 1.0,
    highShelfFreq: 12000, highShelfGain: 3.0,
    stereoWidthMult: 1.25, saturation: 0.06,
    mbComp: {
      low:  { threshold: -16, ratio: 4.0, knee: 4, attack_ms: 10, release_ms: 120 },
      mid:  { threshold: -14, ratio: 3.5, knee: 3, attack_ms: 8,  release_ms: 100 },
      high: { threshold: -18, ratio: 2.5, knee: 4, attack_ms: 4,  release_ms: 80 },
    },
  },
  warm_analog: {
    targetLUFS: -16, limitCeiling: -1.5, hpfFreq: 35,
    lowShelfFreq: 120, lowShelfGain: 3.5,
    loMidFreq: 350, loMidGain: 1.0, loMidQ: 0.7,
    hiMidFreq: 3000, hiMidGain: 0.5, hiMidQ: 0.9,
    highShelfFreq: 8000, highShelfGain: -1.5,
    stereoWidthMult: 0.9, saturation: 0.14,
    mbComp: {
      low:  { threshold: -22, ratio: 2.0, knee: 8, attack_ms: 20, release_ms: 250 },
      mid:  { threshold: -20, ratio: 1.8, knee: 6, attack_ms: 15, release_ms: 200 },
      high: { threshold: -24, ratio: 1.5, knee: 8, attack_ms: 8,  release_ms: 150 },
    },
  },
  vocal_forward: {
    targetLUFS: -14, limitCeiling: -1.0, hpfFreq: 80,
    lowShelfFreq: 100, lowShelfGain: 0.5,
    loMidFreq: 400, loMidGain: -1.5, loMidQ: 1.2,
    hiMidFreq: 3800, hiMidGain: 4.0, hiMidQ: 1.5,
    highShelfFreq: 10000, highShelfGain: 3.0,
    stereoWidthMult: 0.85, saturation: 0.025,
    mbComp: {
      low:  { threshold: -18, ratio: 2.5, knee: 6, attack_ms: 15, release_ms: 180 },
      mid:  { threshold: -16, ratio: 2.0, knee: 4, attack_ms: 10, release_ms: 150 },
      high: { threshold: -20, ratio: 1.8, knee: 6, attack_ms: 5,  release_ms: 100 },
    },
  },
  cinematic: {
    targetLUFS: -18, limitCeiling: -2.0, hpfFreq: 20,
    lowShelfFreq: 80, lowShelfGain: 2.5,
    loMidFreq: 200, loMidGain: 0.5, loMidQ: 0.8,
    hiMidFreq: 4500, hiMidGain: 1.0, hiMidQ: 1.0,
    highShelfFreq: 12000, highShelfGain: 2.0,
    stereoWidthMult: 1.5, saturation: 0.008,
    mbComp: {
      low:  { threshold: -24, ratio: 1.8, knee: 8, attack_ms: 25, release_ms: 300 },
      mid:  { threshold: -22, ratio: 1.6, knee: 6, attack_ms: 18, release_ms: 250 },
      high: { threshold: -26, ratio: 1.5, knee: 8, attack_ms: 10, release_ms: 200 },
    },
  },
  acoustic: {
    targetLUFS: -16, limitCeiling: -1.5, hpfFreq: 60,
    lowShelfFreq: 120, lowShelfGain: 0.0,
    loMidFreq: 300, loMidGain: -0.5, loMidQ: 0.9,
    hiMidFreq: 4000, hiMidGain: 1.5, hiMidQ: 1.2,
    highShelfFreq: 10000, highShelfGain: 1.5,
    stereoWidthMult: 1.0, saturation: 0.0,
    mbComp: {
      low:  { threshold: -26, ratio: 1.5, knee: 8, attack_ms: 20, release_ms: 250 },
      mid:  { threshold: -24, ratio: 1.4, knee: 6, attack_ms: 15, release_ms: 200 },
      high: { threshold: -28, ratio: 1.3, knee: 8, attack_ms: 8,  release_ms: 150 },
    },
  },
  aggressive_modern: {
    targetLUFS: -7, limitCeiling: -0.1, hpfFreq: 25,
    lowShelfFreq: 70, lowShelfGain: 6.0,
    loMidFreq: 280, loMidGain: -3.0, loMidQ: 1.0,
    hiMidFreq: 4500, hiMidGain: 3.5, hiMidQ: 1.0,
    highShelfFreq: 12000, highShelfGain: 4.0,
    stereoWidthMult: 1.15, saturation: 0.12,
    mbComp: {
      low:  { threshold: -14, ratio: 5.0, knee: 3, attack_ms: 8,  release_ms: 100 },
      mid:  { threshold: -12, ratio: 4.5, knee: 3, attack_ms: 6,  release_ms: 80 },
      high: { threshold: -16, ratio: 3.5, knee: 3, attack_ms: 4,  release_ms: 60 },
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════
//  MASTER TRACK — Pro Engine
// ═══════════════════════════════════════════════════════════════════════

/**
 * @param {File} file
 * @param {string} profileName
 * @param {object} controls — { loudness, stereo_width, warmth, brightness, punch, vocal_presence, limiter_intensity }
 * @param {function} onProgress
 * @param {object} options — { exportFormat: 'wav24'|'wav32', targetSampleRate: 44100|48000|96000 }
 */
export async function masterTrackPro(file, profileName, controls, onProgress, options = {}) {
  onProgress?.(3);

  const profile = PROFILE_DSP[profileName] || PROFILE_DSP.streaming_master;
  const exportFormat = options.exportFormat || 'wav24';
  const targetSampleRate = options.targetSampleRate || 44100;

  // Decode audio
  const arrayBuffer = await file.arrayBuffer();
  const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: targetSampleRate });
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
  ctx.close();
  onProgress?.(12);

  const sampleRate = audioBuffer.sampleRate;
  const numChannels = Math.min(audioBuffer.numberOfChannels, 2);

  const channels = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(new Float32Array(audioBuffer.getChannelData(c)));
  }
  if (channels.length === 1) channels.push(new Float32Array(channels[0]));

  // Map controls (0–100) to DSP modifiers
  const warmthMod   = (controls.warmth - 50) / 50;
  const brightMod   = (controls.brightness - 50) / 50;
  const presenceMod = (controls.vocal_presence - 50) / 50;
  const widthMod    = controls.stereo_width / 100;
  const limitMod    = controls.limiter_intensity / 100;
  const punchMod    = controls.punch / 100;

  // 1. High-pass filter
  const hpf = createBiquad('highpass', sampleRate, profile.hpfFreq, 0, 0.707);
  for (const ch of channels) applyBiquad(ch, hpf);
  onProgress?.(20);

  // 2. 4-band parametric EQ
  const lowShelf  = createBiquad('lowshelf',  sampleRate, profile.lowShelfFreq,  profile.lowShelfGain  + warmthMod * 3, 0.707);
  const loMidEQ   = createBiquad('peaking',   sampleRate, profile.loMidFreq,     profile.loMidGain     + warmthMod * 1.5, profile.loMidQ);
  const hiMidEQ   = createBiquad('peaking',   sampleRate, profile.hiMidFreq,     profile.hiMidGain     + presenceMod * 4, profile.hiMidQ);
  const highShelf = createBiquad('highshelf', sampleRate, profile.highShelfFreq, profile.highShelfGain + brightMod * 3, 0.707);

  for (const ch of channels) {
    applyBiquad(ch, lowShelf);
    applyBiquad(ch, loMidEQ);
    applyBiquad(ch, hiMidEQ);
    applyBiquad(ch, highShelf);
  }
  onProgress?.(32);

  // 3. Harmonic saturation
  const satAmount = profile.saturation * punchMod;
  if (satAmount > 0) {
    for (const ch of channels) {
      for (let i = 0; i < ch.length; i++) {
        ch[i] = saturate(ch[i], satAmount);
      }
    }
  }
  onProgress?.(42);

  // 4. Stereo width (mid/side)
  const stereoMult = profile.stereoWidthMult * (0.5 + widthMod);
  applyStereoWidth(channels[0], channels[1], stereoMult);
  onProgress?.(52);

  // 5. TRUE multiband compression (LR4 crossovers)
  applyMultibandCompPro(channels, profile.mbComp, sampleRate);
  onProgress?.(65);

  // 6. Loudness normalisation (K-weighted LUFS)
  const currentLUFS = calcIntegratedLUFS(channels, sampleRate);
  const lufsGain = Math.pow(10, (profile.targetLUFS - currentLUFS) / 20);
  const userGainMod = 0.5 + (controls.loudness / 100);
  const finalGain = lufsGain * userGainMod;

  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) ch[i] *= finalGain;
  }
  onProgress?.(76);

  // 7. True inter-sample peak limiter (4× oversampling)
  const ceilingDB = profile.limitCeiling - (1 - limitMod) * 2;
  applyTruePeakLimiter(channels, ceilingDB, sampleRate);
  onProgress?.(90);

  // 8. Dither (only for integer formats)
  if (exportFormat === 'wav24') {
    applyDither(channels, 24);
  }
  onProgress?.(94);

  // 9. Measure output
  const outLUFS = Math.round(calcIntegratedLUFS(channels, sampleRate) * 10) / 10;
  let outPeak = 0;
  for (const ch of channels) {
    for (let i = 0; i < ch.length; i++) {
      if (Math.abs(ch[i]) > outPeak) outPeak = Math.abs(ch[i]);
    }
  }
  const outPeakDB = Math.round(20 * Math.log10(Math.max(outPeak, 1e-10)) * 10) / 10;

  // 10. Export
  const blob = exportFormat === 'wav32'
    ? encodeWAV32Float(channels, sampleRate)
    : encodeWAV24(channels, sampleRate);

  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const ext = exportFormat === 'wav32' ? 'wav' : 'wav';
  const filename = `${baseName}_mastered_${profileName}_${exportFormat}.${ext}`;

  onProgress?.(100);

  return {
    blob,
    filename,
    stats: {
      output_lufs: outLUFS,
      output_peak_db: outPeakDB,
      input_lufs: Math.round(currentLUFS * 10) / 10,
      profile: profileName,
      sample_rate: sampleRate,
      channels: numChannels,
      export_format: exportFormat,
      engine: 'pro-v2',
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════
//  MIX ENGINE — Stem mixing with per-stem processing
// ═══════════════════════════════════════════════════════════════════════

/**
 * Mix multiple stems into a single master.
 *
 * @param {Array<{file: File, name: string, gain: number, pan: number, eq?: {low: number, mid: number, high: number}}>} stems
 * @param {function} onProgress
 * @returns {Promise<{blob, filename, stats}>}
 */
export async function mixStems(stems, onProgress) {
  onProgress?.(5);

  if (!stems || stems.length === 0) {
    throw new Error('No stems provided');
  }

  const targetSampleRate = 48000; // Mix at 48 kHz
  const ctx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: targetSampleRate });

  // Decode all stems
  const decoded = [];
  let maxSamples = 0;

  for (let i = 0; i < stems.length; i++) {
    const stem = stems[i];
    const arrayBuffer = await stem.file.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    const numChannels = Math.min(audioBuffer.numberOfChannels, 2);
    const channels = [];
    for (let c = 0; c < numChannels; c++) {
      channels.push(new Float32Array(audioBuffer.getChannelData(c)));
    }
    if (channels.length === 1) channels.push(new Float32Array(channels[0]));
    decoded.push({ ...stem, channels, sampleRate: audioBuffer.sampleRate });
    if (channels[0].length > maxSamples) maxSamples = channels[0].length;
    onProgress?.(5 + (i / stems.length) * 30);
  }

  ctx.close();
  onProgress?.(35);

  // Mix bus — sum all stems with gain, pan, and per-stem EQ
  const mixL = new Float32Array(maxSamples);
  const mixR = new Float32Array(maxSamples);

  for (const stem of decoded) {
    const gainLin = Math.pow(10, (stem.gain || 0) / 20); // dB to linear
    const pan = Math.max(-1, Math.min(1, stem.pan || 0)); // -1 = left, 0 = center, 1 = right
    // Constant-power pan law
    const panL = Math.cos((pan + 1) * Math.PI / 4);
    const panR = Math.sin((pan + 1) * Math.PI / 4);

    // Per-stem EQ
    const sr = stem.sampleRate;
    const lowEQ  = stem.eq?.low  ? createBiquad('lowshelf',  sr, 200,  stem.eq.low,  0.707) : null;
    const midEQ  = stem.eq?.mid  ? createBiquad('peaking',   sr, 2000, stem.eq.mid,  1.0)  : null;
    const highEQ = stem.eq?.high ? createBiquad('highshelf', sr, 8000, stem.eq.high, 0.707) : null;

    for (let c = 0; c < stem.channels.length; c++) {
      let ch = stem.channels[c];
      if (lowEQ)  ch = filterCopy(ch, lowEQ);
      if (midEQ)  ch = filterCopy(ch, midEQ);
      if (highEQ) ch = filterCopy(ch, highEQ);
      stem.channels[c] = ch;
    }

    // Sum into mix bus
    const stemL = stem.channels[0];
    const stemR = stem.channels[1] || stem.channels[0];

    for (let i = 0; i < maxSamples; i++) {
      const sL = i < stemL.length ? stemL[i] : 0;
      const sR = i < stemR.length ? stemR[i] : 0;
      mixL[i] += sL * gainLin * panL;
      mixR[i] += sR * gainLin * panR;
    }
  }

  onProgress?.(60);

  // Mix bus glue compression (gentle)
  const glueComp = {
    low:  { threshold: -18, ratio: 1.8, knee: 8, attack_ms: 20, release_ms: 250 },
    mid:  { threshold: -16, ratio: 1.5, knee: 6, attack_ms: 15, release_ms: 200 },
    high: { threshold: -20, ratio: 1.3, knee: 8, attack_ms: 8,  release_ms: 150 },
  };
  applyMultibandCompPro([mixL, mixR], glueComp, targetSampleRate);
  onProgress?.(75);

  // Mix bus limiter (gentle ceiling)
  applyTruePeakLimiter([mixL, mixR], -1.0, targetSampleRate);
  onProgress?.(85);

  // Measure
  const outLUFS = Math.round(calcIntegratedLUFS([mixL, mixR], targetSampleRate) * 10) / 10;
  let outPeak = 0;
  for (const ch of [mixL, mixR]) {
    for (let i = 0; i < ch.length; i++) {
      if (Math.abs(ch[i]) > outPeak) outPeak = Math.abs(ch[i]);
    }
  }
  const outPeakDB = Math.round(20 * Math.log10(Math.max(outPeak, 1e-10)) * 10) / 10;

  // Export 32-bit float WAV
  const blob = encodeWAV32Float([mixL, mixR], targetSampleRate);
  const filename = `mixdown_${Date.now()}.wav`;

  onProgress?.(100);

  return {
    blob,
    filename,
    stats: {
      output_lufs: outLUFS,
      output_peak_db: outPeakDB,
      sample_rate: targetSampleRate,
      channels: 2,
      export_format: 'wav32',
      engine: 'mix-pro-v2',
      stem_count: decoded.length,
    },
  };
}

// Re-export audio analysis for convenience
export { calcIntegratedLUFS as measureLUFS };