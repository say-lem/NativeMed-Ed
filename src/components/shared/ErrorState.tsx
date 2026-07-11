"use client";

import { RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Couldn't load this page",
  message = "We're having trouble connecting right now. This is temporary and not your fault. Please try again in a moment.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <section className="min-h-[50vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto grid place-items-center size-14 rounded-full bg-primary-10 text-primary-100">
          <RefreshCw size={24} />
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-black-others">
          {title}
        </h1>
        <p className="text-subtle-text leading-[150%]">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-[8px] bg-black-others text-white text-sm font-medium px-6 py-3 cursor-pointer hover:opacity-90"
          >
            <RefreshCw size={16} />
            Try again
          </button>
        )}
      </div>
    </section>
  );
}
