import { extendTheme, Progress } from "@chakra-ui/react";
import { useStepsStore } from "../stores/StepsStore";

const ProgressBar = () => {
  const { step } = useStepsStore();
  const totalSteps = 7;
  const progressValue = (step / totalSteps) * 100;

  return <Progress value={progressValue} colorScheme="gray" size="sm" />;
};

export default ProgressBar;
