import React from "react";

const ProgressBar = ({ currentStep }) => {
  const steps = ["Shipping", "Payment", "Confirmation"];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 tracking-wider">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div
              className={`${
                currentStep === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              } w-8 h-8 flex items-center justify-center rounded-full font-bold`}
            >
              {index + 1}
            </div>
            <div
              className={`${
                currentStep === index + 1 ? "text-blue-600" : "text-gray-900"
              } mt-2 font-medium`}
            >
              {step}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`${
                currentStep > index + 1
                  ? "bg-blue-600"
                  : "bg-gray-300"
              } h-1 flex-1 mx-2`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;
