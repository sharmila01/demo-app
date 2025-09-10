"use client";

import { fetcher } from "@/app/utils/api";
import {
  useDashboardStore,
  OnboardingStep,
} from "@/app/store/useDashboardStore";
import { useEffect } from "react";
import { CheckCircle, Circle } from "lucide-react";

export default function OnboardingWorkflow() {
  const steps = useDashboardStore((state) => state.onboardingSteps);
  const setSteps = useDashboardStore((state) => state.setOnboardingSteps);

  useEffect(() => {
    fetcher<{ steps: string[] }>("/api/onboarding/workflow")
      .then((data) => {
        // Map string[] to OnboardingStep[]
        const mappedSteps: OnboardingStep[] = data.steps.map((name, idx) => ({
          name,
          completed: idx < 2,
        }));
        setSteps(mappedSteps);
      })
      .catch(console.error);
  }, [setSteps]);

  if (!steps || steps.length === 0)
    return (
      <div className="p-4 bg-white rounded-xl shadow text-gray-400">
        Loading workflow...
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h2 className="text-lg font-bold text-gray-500">Onboarding Workflow</h2>
      <ol className="relative border-l-2 border-gray-200 ml-4 space-y-6">
        {steps.map((step, idx) => (
          <li key={idx} className="relative">
            {/* Circle marker */}
            <span className="absolute -left-5 flex items-center justify-center w-8 h-8 rounded-full border-2 border-blue-600 bg-white z-10">
              {step.completed ? (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </span>
            {/* Step text */}
            <div className="pl-4">
              <p
                className={`font-medium ${
                  step.completed ? "text-gray-800" : "text-gray-400"
                }`}
              >
                {step.name}
              </p>
            </div>
            {/* Connecting line */}
            {idx !== steps.length - 1 && (
              <span className="absolute left-0 top-8 w-0.5 h-full bg-gray-200"></span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
