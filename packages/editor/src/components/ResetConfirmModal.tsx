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
      onClick={onClose}
    >
      <div
        className="rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 ds-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 id={id} className="text-2xl font-light mb-2">
          {title}
        </h4>
        <p
          className="text-sm mb-4 ds-text-card"
        >
          {message}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="ds-modal-btn h-9 px-4 text-sm font-light rounded-lg border transition-colors hover:opacity-80 ds-surface ds-border"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="ds-modal-btn h-9 px-4 text-sm font-light rounded-lg transition-colors hover:opacity-80 ds-bg-destructive ds-text-destructive-fg"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
