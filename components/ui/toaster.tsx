"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  // Debug: log toasts
  if (toasts.length > 0) {
    console.log("Toaster: Rendering toasts", toasts);
  }

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        open,
        onOpenChange,
        duration = 3000,
        ...props
      }) {
        return (
          <Toast
            key={id}
            open={open}
            onOpenChange={onOpenChange}
            duration={duration}
            variant="default"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl z-[10000]"
            {...props}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
