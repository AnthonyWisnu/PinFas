import { Check } from 'lucide-react'

export function StepIndicator({ steps = [], currentStep = 0 }) {
  return (
    <div className="w-full">
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((step, index) => {
          const done = index < currentStep
          const active = index === currentStep
          const circleClass = done
            ? 'bg-secondary text-white'
            : active
              ? 'bg-primary text-white'
              : 'border-2 border-slate-300 text-slate-500'

          return (
            <li key={step.id ?? step.label} className="relative flex flex-col items-center gap-2 text-center">
              {index < steps.length - 1 ? (
                <span className="absolute left-1/2 top-4 h-1 w-full bg-slate-200" aria-hidden="true">
                  <span
                    className={`block h-full transition-all duration-300 ${done ? 'w-full bg-secondary' : 'w-0 bg-secondary'}`}
                  />
                </span>
              ) : null}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${circleClass}`}
              >
                {done ? <Check aria-hidden="true" size={16} /> : index + 1}
              </span>
              <span className={`text-xs ${active ? 'font-bold text-primary' : 'font-semibold text-slate-500'}`}>
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
