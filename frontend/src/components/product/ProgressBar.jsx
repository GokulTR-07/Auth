import React from "react";
import "./ProgressBar.css"; // Import the CSS file

const ProgressBar = ({ currentStep }) => {
  const steps = ["Shipping", "Payment", "Confirmation"];

  return (
    <div className="progress-bar-container">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="progress-step">
            <div
              className={`progress-number ${
                currentStep === index + 1 ? "current" : "inactive"
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`progress-label ${
                currentStep === index + 1 ? "current" : "inactive"
              }`}
            >
              {step}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`progress-line ${
                currentStep > index + 1 ? "completed" : ""
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressBar;
