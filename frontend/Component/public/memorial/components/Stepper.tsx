"use client";

import React from "react";

type StepId = 1 | 2 | 3 | 4 | 5;

const steps: Array<{ id: StepId; label: string }> = [
  { id: 1, label: "Personal Details" },
  { id: 2, label: "Obituary Content" },
  { id: 3, label: "Media Upload" },
  { id: 4, label: "Others" },
  { id: 5, label: "Payment" },
];

export default function Stepper({ currentStep }: { currentStep: StepId }) {
  return (
    <div className="w-full overflow-hidden">
      <div className="grid grid-cols-5 gap-4 sm:gap-6">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <div key={step.id} className="relative flex flex-col items-center">
              {index < steps.length - 1 ? (
                <div className="absolute left-[56%] top-6 hidden h-px w-[calc(100%-2rem)] bg-slate-200 sm:block" />
              ) : null}
              <div
                className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition sm:h-12 sm:w-12 ${
                  isActive || isComplete
                    ? "border-[#274877] bg-[#274877] text-white"
                    : "border-slate-400 bg-white text-slate-600"
                }`}
              >
                {step.id}
              </div>
              <p className="mt-2 text-center text-[0.7rem] leading-4 text-slate-700 sm:text-sm">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
