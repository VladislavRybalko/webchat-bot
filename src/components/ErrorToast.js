"use client";

import WarningIcon from "./icons/WarningIcon";

export default function ErrorToast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="animate-slide-in fixed right-4 top-4 z-50 max-w-sm rounded-xl bg-red-500/90 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <WarningIcon className="h-5 w-5 flex-shrink-0" />
        <span className="flex-1">{message}</span>
        <button
          onClick={onDismiss}
          className="ml-1 flex h-6 w-6 items-center justify-center rounded-full hover:bg-white/20 cursor-pointer transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
