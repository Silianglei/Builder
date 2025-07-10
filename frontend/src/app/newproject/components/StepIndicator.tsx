interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

const stepTitles = [
  "Details",
  "Features",
  "Review"
]

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Mobile view - Progress bar only */}
      <div className="sm:hidden mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm font-medium">{stepTitles[currentStep - 1]}</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1.5">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop view - Minimalist dots */}
      <div className="hidden sm:block mb-12">
        <div className="flex items-center justify-center space-x-3">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep

            return (
              <div key={stepNumber} className="flex items-center">
                {/* Step dot */}
                <div className="relative">
                  <div
                    className={`
                      w-2 h-2 rounded-full transition-all duration-300
                      ${isCompleted 
                        ? 'bg-blue-400' 
                        : isCurrent
                        ? 'bg-white scale-150'
                        : 'bg-white/20'
                      }
                    `}
                  />
                  {/* Step title on hover */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {stepTitles[index]}
                    </span>
                  </div>
                </div>

                {/* Connector line */}
                {index < totalSteps - 1 && (
                  <div 
                    className={`
                      w-12 h-0.5 mx-1 transition-all duration-500
                      ${stepNumber < currentStep 
                        ? 'bg-blue-400' 
                        : 'bg-white/10'
                      }
                    `}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Current step title */}
        <div className="text-center mt-6">
          <p className="text-sm font-medium text-gray-300">
            {stepTitles[currentStep - 1]}
          </p>
        </div>
      </div>
    </div>
  )
}