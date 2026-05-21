import { Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { cn } from '@/lib/utils';

/**
 * VoiceButton — drop-in mic button that appends speech to a text value.
 *
 * Props:
 *   value      — current string value of the field
 *   onChange   — (newValue: string) => void  — called with appended transcript
 *   className  — extra classes for the button
 *   size       — 'sm' | 'md' (default 'md')
 */
export default function VoiceButton({ value = '', onChange, className, size = 'md' }) {
  const { isListening, isSupported, toggle, error } = useVoiceInput({
    onTranscript: (text) => {
      const separator = value && !value.endsWith(' ') ? ' ' : '';
      onChange?.(value + separator + text);
    },
  });

  if (!isSupported) return null;

  return (
    <button
      type="button"
      title={isListening ? 'Stop recording' : 'Voice input — click and speak'}
      onClick={toggle}
      className={cn(
        'rounded-full flex items-center justify-center transition-all shrink-0 border',
        size === 'sm' ? 'w-7 h-7' : 'w-9 h-9',
        isListening
          ? 'bg-red-500/20 border-red-500/60 text-red-400 animate-pulse'
          : 'bg-secondary/60 border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40',
        className
      )}
    >
      {isListening
        ? <MicOff className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
        : <Mic className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      }
    </button>
  );
}