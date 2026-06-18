import React, { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    const timers = toasts
      .filter((toast) => toast.open)
      .map((toast) => setTimeout(() => dismiss(toast.id), 4000));

    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  const visibleToasts = toasts.filter((t) => t.open !== false);

  return (
    <ToastProvider>
      {visibleToasts.map(function ({ id, title, description, action, onOpenChange: _onOpenChange, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose onClick={() => dismiss(id)} />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
