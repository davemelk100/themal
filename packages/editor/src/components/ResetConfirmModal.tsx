import React from "react";

interface ResetConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  id: string;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Reset",
  id,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
    >
      <div
        className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
        }}
      >
        <h4 id={id} className="text-2xl font-light mb-2">
          {title}
        </h4>
        <p
          className="text-[14px] mb-4"
          style={{ color: "hsl(var(--card-foreground))" }}
        >
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: "transparent",
              color: "hsl(var(--card-foreground))",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: "hsl(var(--destructive))",
              color: "hsl(var(--destructive-foreground))",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
