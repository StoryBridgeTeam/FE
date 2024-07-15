import { Box, Flex, Text, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useStepsStore } from "./stores/useStepsStore";
import { useUserTypeStore } from "./stores/useUserTypeStore";
import NextStepsButton from "./components/NextStepsButton";
import ProgressBar from "./components/ProgressBar";
import TypeSelector from "./components/TypeSelector";
import TermsAgreement from "./components/TermsAgreement";
import PhoneVerificationForm from "./components/PhoneVerificationForm";
import EmailVerificationForm from "./components/EmailVerificationForm";
import VerificationCodeForm from "./components/VerificationCodeForm";
import PasswordForm from "./components/PasswordForm";
import NicknameForm from "./components/NicknameForm";
import SignupComplete from "./components/SignupComplete";

const SignupPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentStep = useStepsStore((state) => state.step);
  const userType = useUserTypeStore((state) => state.userType);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TypeSelector />;
      case 2:
        return <TermsAgreement />;
      case 3:
        if (userType === "korea") {
          return <PhoneVerificationForm />;
        } else return <EmailVerificationForm />;
      case 4:
        return <VerificationCodeForm />;
      case 5:
        return <PasswordForm />;
      case 6:
        return <NicknameForm />;
      default:
        return <SignupComplete />;
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" direction="column">
      <Box
        bg="white"
        p={8}
        shadow={isMobile ? undefined : "xl"}
        border={isMobile ? undefined : "1px"}
        borderColor={isMobile ? undefined : "#CDCDCD"}
        maxW="lg" //lg
        w="full"
        borderRadius="3xl"
      >
        <ProgressBar />
        <Stack spacing={1} mb={24}>
          {renderStep()}
        </Stack>
        {currentStep === 1 ? null : (
          <Box mt="auto">
            <NextStepsButton currentStep={currentStep} />
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default SignupPage;
