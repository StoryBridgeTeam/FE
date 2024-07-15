import { Box, Flex, Text, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useStepsStore } from "./stores/useStepsStore";
import { useUserTypeStore } from "./stores/useUserTypeStore";
import NextStepsButton from "./components/NextStepsButton";
import ProgressBar from "./components/ProgressBar";
import SignupTypeSelector from "./components/TypeSelector";
import TermsAgreement from "./components/TermsAgreement";
import PhoneVerification from "./components/PhoneVerification";

const SignupPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentStep = useStepsStore((state) => state.step);
  const userType = useUserTypeStore((state) => state.userType);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SignupTypeSelector />;
      case 2:
        return <TermsAgreement />;
      case 3:
        return userType === "korea" ? <PhoneVerification /> : null;
      default:
        return <div>회원가입이 완료되었습니다.</div>;
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
        maxW="lg"
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
