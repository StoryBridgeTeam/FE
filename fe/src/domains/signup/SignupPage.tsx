import React, { useEffect } from "react";
import { Box, Flex, Stack, useBreakpointValue } from "@chakra-ui/react";
import { useStepsStore } from "./stores/StepsStore";
import { useSignUpStore } from "./stores/SignUpStore";
import NextStepsButton from "./components/NextStepsButton";
import ProgressBar from "./components/ProgressBar";
import RegionSelector from "./components/RegionSelector";
import TermsAgreement from "./components/TermsAgreement";
import PhoneVerificationForm from "./components/PhoneVerificationForm";
import EmailVerificationForm from "./components/EmailVerificationForm";
import VerificationCodeForm from "./components/VerificationCodeForm";
import PasswordForm from "./components/PasswordForm";
import NicknameForm from "./components/NicknameForm";
import SignupComplete from "./components/SignupComplete";
import { useTranslation } from "react-i18next";

const SignupPage: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const currentStep = useStepsStore((state) => state.step);
  const region = useSignUpStore((state) => state.region);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (region === "KR") {
      i18n.changeLanguage("ko");
    } else {
      i18n.changeLanguage("en");
    }
  }, [region, i18n]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegionSelector />;
      case 2:
        return <TermsAgreement />;
      case 3:
        return region === "KR" ? (
          <PhoneVerificationForm />
        ) : (
          <EmailVerificationForm />
        );
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
        maxW="lg"
        w="full"
        borderRadius="3xl"
      >
        <ProgressBar />
        <Stack spacing={1} mb={24}>
          {renderStep()}
        </Stack>
        {currentStep !== 1 && (
          <Box mt="auto">
            <NextStepsButton currentStep={currentStep} />
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default SignupPage;
