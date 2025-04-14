export default function CartProgress({ currentStep, steps }) {
  return (
    <div className="relative flex justify-between px-4 sm:px-0">
      {/* Progress Line */}
      <div className="absolute left-0 top-[15px] h-[2px] w-full bg-gray-200">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex w-full justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex flex-col items-center ${
              step.number <= currentStep ? "text-black" : "text-gray-400"
            }`}
          >
            <div
              className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${
                step.number <= currentStep
                  ? "bg-black text-white"
                  : step.number < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {step.number < currentStep ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span className="text-center text-xs sm:text-sm">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
