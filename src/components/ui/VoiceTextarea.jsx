import { Textarea } from '@/components/ui/textarea';
import VoiceButton from '@/components/ui/VoiceButton';
import { cn } from '@/lib/utils';

/**
 * VoiceTextarea — a Textarea with a built-in mic button.
 * Drop-in replacement for <Textarea> anywhere in the app.
 * Accepts all standard textarea props plus an optional `wrapperClassName`.
 */
export default function VoiceTextarea({ value, onChange, className, wrapperClassName = '', ...props }) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <Textarea
        value={value}
        onChange={onChange}
        className={cn('pr-11', className)}
        {...props}
      />
      <div className="absolute bottom-2.5 right-2.5">
        <VoiceButton
          value={value}
          onChange={(newVal) => onChange?.({ target: { value: newVal } })}
          size="sm"
        />
      </div>
    </div>
  );
}