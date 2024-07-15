import { Box, Stack, Text, Input, Select } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { usePhoneVerification } from "../hooks/usePhoneVerification";
import InputMask from "react-input-mask";

const PhoneVerificationForm = () => {
  const { t } = useTranslation();
  const {
    username,
    phoneNumber,
    telecom,
    handleNameChange,
    handlePhoneNumberChange,
    handleTelecomChange,
    isInputNameValid,
    isInputNumberValid,
  } = usePhoneVerification();

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} mb={14} textAlign="left">
        인증을 위한 정보를 입력해주세요
      </Text>
      <Stack spacing={10} mt={4} mb={6}>
        <Input
          ml="2"
          isInvalid={username !== "" && !isInputNameValid()}
          variant="flushed"
          borderColor="gray.300"
          placeholder="성명를 입력해주세요"
          value={username}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        <Input
          ml="2"
          isInvalid={phoneNumber !== "" && !isInputNumberValid()}
          variant="flushed"
          borderColor="gray.300"
          type="tel"
          placeholder="전화번호를 입력해주세요"
          as={InputMask}
          mask="999-9999-9999"
          maskChar={null}
          value={phoneNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
        />

        <Select
          ml="2"
          value={telecom}
          onChange={(e) => handleTelecomChange(e.target.value)}
        >
          <option value="" disabled style={{ color: "gray" }}>
            통신사를 선택해주세요
          </option>
          <option value="SKT">SKT</option>
          <option value="KT">KT</option>
          <option value="LGU+">LG U+</option>
        </Select>
      </Stack>
    </Box>
  );
};

export default PhoneVerificationForm;
