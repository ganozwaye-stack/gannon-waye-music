import React from 'react';
import { isSet } from '@/components/release-approval/approvalFields';
import FieldRow from '@/components/release-approval/FieldRow';

// The master audio: presence, a player when one is set, and an explicit
// warning when there is nothing to deliver.
export default function AudioField({ url }) {
  return (
    <div className="space-y-2">
      <FieldRow label="master_audio_url" value={url} />
      {isSet(url) ? (
        <audio controls preload="none" src={url} className="w-full">
          Your browser does not support audio playback.
        </audio>
      ) : (
        <p className="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 font-body text-xs leading-relaxed text-amber-300">
          No master audio on this release
        </p>
      )}
    </div>
  );
}