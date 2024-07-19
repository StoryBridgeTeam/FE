import { useState } from "react";
import {
  Box,
  Input,
  InputGroup,
  Stack,
  Text,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { usePasswordForm } from "../hooks/usePasswordForm";

const PasswordForm = () => {
  const { t } = useTranslation();
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} mb={2} textAlign="left">
        {t("signup.PasswordForm.title")}
      </Text>
      <Text fontSize="sm" ml={1} mb={14} textAlign="left">
        {t("signup.PasswordForm.subtitle")}
      </Text>
      <Stack spacing={10} mt={4} mb={6}>
        <InputGroup>
          <Input
            ml="2"
            type={showPassword ? "text" : "password"}
            isInvalid={password !== "" && !isValidPassword()}
            variant="flushed"
            borderColor="gray.300"
            placeholder={t("signup.PasswordForm.passwordPlaceholder")}
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
          />
          <InputRightElement width="3rem">
            <IconButton
              aria-label={showPassword ? "Hide password" : "Show password"}
              icon={showPassword ? <HiEyeOff /> : <HiEye />}
              color="gray"
              variant="ghost"
              onClick={togglePasswordVisibility}
              h="1.75rem"
            />
          </InputRightElement>
        </InputGroup>

        <InputGroup>
          <Input
            ml="2"
            type={showConfirmPassword ? "text" : "password"}
            isInvalid={confirmPassword !== "" && !isSamePassword()}
            variant="flushed"
            borderColor="gray.300"
            placeholder={t("signup.PasswordForm.confirmPasswordPlaceholder")}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          />
          <InputRightElement width="3rem">
            <IconButton
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              icon={showConfirmPassword ? <HiEyeOff /> : <HiEye />}
              color="gray"
              variant="ghost"
              onClick={toggleConfirmPasswordVisibility}
              h="1.75rem"
            />
          </InputRightElement>
        </InputGroup>

        <Box h={6} ml={2} mt={4} mb={4}>
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
        </Box>
      </Stack>
    </Box>
  );
};

export default PasswordForm;
