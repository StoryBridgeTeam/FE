import React, {ReactNode, useEffect, useState} from "react";
import {
    Box,
    Button,
    Center,
    Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel,
    Heading,
    HStack, IconButton,
    Input, InputGroup, InputRightElement,
    Select,
    Text,
    useBreakpointValue,
    useRadio, useToast,
    VStack
} from "@chakra-ui/react";
import {KaKaoLoginButton} from "../../login/components/SocailLogin";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import {HiEye, HiEyeOff} from "react-icons/hi";
import {usePasswordForm} from "../hooks/usePasswordForm";
import {useNicknameForm} from "../hooks/useNicknameForm";
import {fetchTempInfo, registerOauthAccount} from "../api/oauthAPI";
import {useToastMessage} from "../../../common/hooks/useToastMessage";

const OauthSignupPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const { t } = useTranslation();
    const {showToast} = useToastMessage();
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("invite")||"";
    const oid = queryParams.get("oid") || "";
    const otoken = queryParams.get("otoken") || "";

    const {
        password,
        confirmPassword,
        handlePasswordChange,
        handleConfirmPasswordChange,
        isValidPassword,
        isSamePassword,
        hasPasswordEngLetter,
        hasPasswordNumber,
        hasPasswordSpecialChar,
        isValidPasswordLength,
    } = usePasswordForm();

    const { nickname, handleNicknameChange, validLength, checkDuplicated, duplicated } = useNicknameForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [tempInfo, setTempInfo] = useState<{
        name:string,
        email:string,
        phoneNumber:string,
        gender:string,
        birthDate:string
    }>();

    useEffect(() => {
        fetchInfo();
    }, []);

    const handleRegister = () => {
        registerOauthAccount(token, Number(oid), otoken, nickname, password);
        showToast("회원가입 성공", "회원가입을 완료했습니다.", "success");
        navigate("/");
    };

    const fetchInfo = async () => {
        const data = await fetchTempInfo(Number(oid), otoken);
        console.log("============", data)
        setTempInfo(data);
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    return <Flex minH="100vh" align="center" justify="center" direction="column" >
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
                        <HStack w={"100%"} gap={10}>
                            <Heading width={"100%"} size={"sm"}>이름</Heading>
                            <FormControl>
                                <Input width={"100%"} value={tempInfo?.name} size={"sm"} disabled={true}/>
                            </FormControl>
                        </HStack>
                        <HStack w={"100%"} gap={10}>
                            <Heading width={"100%"} size={"sm"}>성별</Heading>
                            <Select placeholder='성별' w={"100%"} value={tempInfo?.gender} size={"sm"} disabled={true}>
                                <option value='MALE'>남</option>
                                <option value='FEMALE'>여</option>
                            </Select>
                            <Heading width={"100%"} size={"sm"}>생년월일</Heading>
                            <Input width={"100%"} size={"sm"} value={tempInfo?.birthDate} disabled={true}/>
                        </HStack>
                        <HStack w={"100%"} gap={10}>
                            <Heading width={"100%"} size={"sm"}>이메일</Heading>
                            <FormControl>
                                <Input width={"100%"} size={"sm"} value={tempInfo?.email} disabled={true}/>
                            </FormControl>
                        </HStack>
                        <HStack w={"100%"} gap={10}>
                            <Heading width={"100%"} size={"sm"}>휴대폰번호</Heading>
                            <FormControl>
                                <Input width={"100%"} size={"sm"} value={tempInfo?.phoneNumber} disabled={true}/>
                            </FormControl>
                        </HStack>
                    </VStack>
                    <VStack w={"100%"}>
                        <HStack w={"100%"} gap={10}>
                            <Heading width={"100%"} size={"sm"}>닉네임</Heading>
                            <FormControl w={"100%"}
                                         isInvalid={duplicated || !validLength}
                            >
                                <Input
                                    width={"100%"}
                                    // placeholder={t("signup.NicknameForm.placeholder")}
                                    value={nickname}
                                    size={"sm"}
                                    onBlur={() => checkDuplicated()}
                                    onChange={(e) => handleNicknameChange(e.target.value)}
                                />
                                {
                                    duplicated && <FormErrorMessage fontSize={"12px"}>중복된 닉네임입니다.</FormErrorMessage>
                                }
                                {
                                    !validLength && <FormErrorMessage fontSize={"12px"}>3자 이상 10자 이하 닉네임을 입력해주세요.</FormErrorMessage>
                                }
                            </FormControl>
                        </HStack>
                        <HStack w={"100%"} gap={10}
                                position={"relative"}
                        >
                            <Heading width={"100%"} size={"sm"}>비밀번호</Heading>
                            <FormControl
                                isInvalid={password !== "" && !isValidPassword()}
                            >
                                <Input
                                    w={"100%"}
                                    size={"sm"}
                                    type={showPassword ? "text" : "password"}
                                    // borderColor="gray.300"
                                    // placeholder={t("signup.PasswordForm.passwordPlaceholder")}
                                    value={password}
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                />
                            </FormControl>
                                <IconButton
                                    position={"absolute"}
                                    zIndex={999}
                                    opacity={"50%"}
                                    right={0}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    icon={showPassword ? <HiEyeOff /> : <HiEye />}
                                    color="gray"
                                    variant="ghost"
                                    onClick={togglePasswordVisibility}
                                    size={"sm"}
                                />
                        </HStack>
                        <HStack w={"100%"} gap={10} position={"relative"}>
                            <Heading width={"100%"} size={"sm"}>비밀번호 확인</Heading>
                            <FormControl
                                isInvalid={confirmPassword !== "" && !isSamePassword()}
                            >
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    size={"sm"}
                                    // placeholder={t("signup.PasswordForm.confirmPasswordPlaceholder")}
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                                />
                            </FormControl>
                                    <IconButton
                                        position={"absolute"}
                                        zIndex={999}
                                        opacity={"50%"}
                                        right={0}
                                        aria-label={
                                            showConfirmPassword ? "Hide password" : "Show password"
                                        }
                                        icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
                                        color="gray"
                                        variant="ghost"
                                        onClick={toggleConfirmPasswordVisibility}
                                        size={"sm"}
                                    />
                        </HStack>
                        <Flex w={"100%"} mt={5} fontSize={15} justifyContent={"end"}>
                            {confirmPassword === "" && password === "" ? null : (
                                <Box>
                                    <Text color={hasPasswordEngLetter() ? "blue.500" : "red.500"}>
                                        {hasPasswordEngLetter() ? "✔" : "✖"}{" "}
                                        {t("signup.PasswordForm.engLetter")}
                                    </Text>
                                    <Text color={hasPasswordNumber() ? "blue.500" : "red.500"}>
                                        {hasPasswordNumber() ? "✔" : "✖"}{" "}
                                        {t("signup.PasswordForm.number")}
                                    </Text>
                                    <Text color={hasPasswordSpecialChar() ? "blue.500" : "red.500"}>
                                        {hasPasswordSpecialChar() ? "✔" : "✖"}{" "}
                                        {t("signup.PasswordForm.specialChar")}
                                    </Text>
                                    <Text color={isValidPasswordLength() ? "blue.500" : "red.500"}>
                                        {isValidPasswordLength() ? "✔" : "✖"}{" "}
                                        {t("signup.PasswordForm.length")}
                                    </Text>
                                    <Text color={isSamePassword() ? "blue.500" : "red.500"}>
                                        {isSamePassword() ? "✔" : "✖"} {t("signup.PasswordForm.same")}
                                    </Text>
                                </Box>
                            )}
                        </Flex>
                    </VStack>
                    <Button mt={5} w={"100%"} isDisabled={
                        !(hasPasswordEngLetter() && hasPasswordNumber() && hasPasswordSpecialChar()
                        && isValidPasswordLength() && isSamePassword() && validLength && !duplicated)
                    }
                            onClick={handleRegister}
                    >
                        회원가입 완료
                    </Button>
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
}
export default OauthSignupPage;