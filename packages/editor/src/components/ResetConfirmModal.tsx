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
      className="ds-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={id}
      onClick={onClose}
    >
      <div
        className="ds-modal-panel rounded-lg p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 id={id} className="text-2xl mb-2">
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
            className="ds-modal-btn h-9 px-4 text-sm rounded-lg border transition-colors hover:opacity-80 ds-surface ds-border"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="ds-modal-btn h-9 px-4 text-sm rounded-lg transition-colors hover:opacity-80 ds-bg-destructive ds-text-destructive-fg"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
