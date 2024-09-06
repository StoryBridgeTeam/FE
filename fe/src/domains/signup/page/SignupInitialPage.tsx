import React from "react";
import {Box, Button, Center, Flex, Heading, Stack, Text, useBreakpointValue, VStack} from "@chakra-ui/react";
import ProgressBar from "../components/ProgressBar";
import NextStepsButton from "../components/NextStepsButton";
import {useLocation, useNavigate} from "react-router-dom";
import {GoogleLoginButton, KaKaoLoginButton, NaverLoginButton, SocialLogin} from "../../login/components/SocailLogin";
import {useTranslation} from "react-i18next";
import {useSocialLogin} from "../../login/hooks/useSocialLogin";

const SignupInitialPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const navigate = useNavigate();

    const { t } = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const useSocialHook = useSocialLogin(token);

    return (
        <Flex minH="100vh" align="center" justify="center" direction="column" >
            <Box
                bg="white"
                p={8}
                // shadow={isMobile ? undefined : "xl"}
                border={isMobile ? undefined : "1px"}
                borderColor={isMobile ? undefined : "#CDCDCD"}
                maxW="lg"
                w="full"
                borderRadius="3xl"
            >
                {token ? (
                    <VStack w={"100%"} justifyContent={"center"} alignItems={"center"} >
                        <Heading size={"md"} mb={6}>{t("signup.InitialPage.title")}</Heading>
                        <VStack w={"100%"} gap={2}>
                            <Button w={"100%"} position="relative" onClick={() => token ? navigate(`/signup/storybridge?token=${token}`) : navigate("/signup/storybridge")}>
                                StoryBridge
                            </Button>
                            <KaKaoLoginButton token={token}/>
                            <NaverLoginButton token={token}/>
                            <GoogleLoginButton token={token}/>
                        </VStack>
                    </VStack>
                ) : (
                    <Center>
                        <Text fontSize="lg" color="red.500" textAlign="center">
                            초대토큰이 존재하지 않습니다. <br />
                            회원가입이 불가능합니다. <br />
                            <br />
                            Invitation token does not exist. <br />
                            Unable to sign up.
                        </Text>
                    </Center>
                )}
            </Box>
        </Flex>
    );
}

export default SignupInitialPage;