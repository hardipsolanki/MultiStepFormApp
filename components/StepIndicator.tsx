import StepIndicator from "react-native-step-indicator";

const labels = ["Personal", "Address", "Professional", "Review"];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,

  stepStrokeCurrentColor: "#00AEEF",
  stepStrokeFinishedColor: "#00AEEF",
  stepStrokeUnFinishedColor: "#ccc",

  separatorFinishedColor: "#00AEEF",
  separatorUnFinishedColor: "#ccc",

  stepIndicatorFinishedColor: "#00AEEF",
  stepIndicatorUnFinishedColor: "#fff",
  stepIndicatorCurrentColor: "#fff",

  stepIndicatorLabelFontSize: 12,
  currentStepIndicatorLabelFontSize: 12,

  stepIndicatorLabelCurrentColor: "#00AEEF",
  stepIndicatorLabelFinishedColor: "#fff",
  stepIndicatorLabelUnFinishedColor: "#ccc",

  labelColor: "#999",
  currentStepLabelColor: "#000000",
};

export default function StepHeader({ step }: { step: number }) {
  return (
    <StepIndicator
      stepCount={labels.length}
      currentPosition={step}
      labels={labels}
      customStyles={customStyles}
    />
  );
}
