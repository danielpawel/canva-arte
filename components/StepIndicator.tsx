"use client";

interface Step {
  numero: number;
  label: string;
}

const steps: Step[] = [
  { numero: 1, label: "Dados" },
  { numero: 2, label: "Foto" },
  { numero: 3, label: "Template" },
  { numero: 4, label: "Resultado" },
];

export default function StepIndicator({ atual }: { atual: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step.numero} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                step.numero < atual
                  ? "bg-blue-600 text-white"
                  : step.numero === atual
                  ? "bg-blue-600 text-white ring-4 ring-blue-100"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              {step.numero < atual ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.numero
              )}
            </div>
            <span
              className={`text-xs font-medium ${
                step.numero <= atual ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`h-0.5 w-10 mb-4 transition-colors ${
                step.numero < atual ? "bg-blue-600" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
