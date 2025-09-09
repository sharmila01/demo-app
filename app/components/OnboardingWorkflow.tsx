import { fetcher } from "@/app/utils/api";
import { useDashboardStore } from "@/app/store/useDashboardStore";
import { useEffect } from "react";

export default function OnboardingWorkflow() {
  const steps = useDashboardStore((state) => state.onboardingSteps);
  const setSteps = useDashboardStore((state) => state.setOnboardingSteps);

  useEffect(() => {
    fetcher<{ steps: string[] }>("/api/onboarding/workflow")
      .then((data) => setSteps(data.steps))
      .catch(console.error);
  }, [setSteps]);

  if (!steps || steps.length === 0)
    return <div className="p-4 bg-white rounded-xl shadow text-gray-400">Loading workflow...</div>;

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">
      <h2 className="text-lg font-bold mb-2 text-gray-500">Onboarding Workflow</h2>
      <ol className="list-decimal list-inside space-y-1 text-gray-700">
        {steps.map((step, idx) => (
          <li key={idx} className="px-2 py-1 border-l-2 border-blue-600">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
