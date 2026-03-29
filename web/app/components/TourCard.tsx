"use client";

import type { CardComponentProps } from "nextstepjs";

export default function TourCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="w-[340px] rounded-2xl border border-border bg-card shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-5 py-3.5">
        {step.icon && (
          <span className="text-[16px]">{step.icon}</span>
        )}
        <span className="flex-1 text-[14px] font-medium text-foreground">
          {step.title}
        </span>
        <span className="font-mono text-[11px] text-muted">
          {currentStep + 1}/{totalSteps}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 text-[13px] leading-relaxed text-muted">
        {step.content}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        {step.showSkip ? (
          <button
            onClick={skipTour}
            className="cursor-pointer font-mono text-[11px] text-muted transition-colors hover:text-foreground"
          >
            Skip
          </button>
        ) : (
          <span />
        )}

        {step.showControls && (
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={prevStep}
                className="cursor-pointer rounded-lg border border-border px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:text-foreground hover:border-foreground/20"
              >
                Back
              </button>
            )}
            <button
              onClick={isLast ? skipTour : nextStep}
              className="cursor-pointer rounded-lg bg-card-dark px-3 py-1.5 font-mono text-[11px] font-medium text-white transition-colors hover:bg-card-dark/80"
            >
              {isLast ? "Done" : "Next"}
            </button>
          </div>
        )}
      </div>

      {/* Arrow */}
      {arrow}
    </div>
  );
}
