import { useEffect } from "react";
import { Box, Stack, Text, Input, Select } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { usePhoneVerification } from "../hooks/usePhoneVerification";
import InputMask from "react-input-mask";

const PhoneVerification = () => {
  const { t } = useTranslation();
  const {
    inputName,
    inputNumber,
    inputCode,
    // handleNameChange,
    // handlePhoneNumberChange,
    // handleCodeChange,
    setInputName,
    setInputNumber,
    setInputCode,
    handleSendCode,
    setTelecom,
  } = usePhoneVerification();

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} mb={14} textAlign="left">
        인증을 위한 정보를 입력해주세요
      </Text>
      <Stack spacing={10} mt={4} mb={6}>
        <Input
          ml="2"
          variant="flushed"
          borderColor="gray.300"
          placeholder="성명를 입력해주세요"
          value={inputName}
          onChange={(e) => s(e.target.value)}
        />
        <Input
          ml="2"
          variant="flushed"
          borderColor="gray.300"
          type="tel"
          placeholder="전화번호를 입력해주세요"
          as={InputMask}
          mask="999-9999-9999"
          maskChar={null}
          value={inputNumber}
          onChange={(e) => handlePhoneNumberChange(e.target.value)}
        />

        <Select
          ml="2"
          placeholder="통신사를 선택해주세요"
          onChange={() => setTelecom}
        >
          <option value="SKT">SKT</option>
          <option value="KT">KT</option>
          <option value="LG U+">LG U+</option>
        </Select>
        {/* {hasVerificationCode && (
          <Input
            ml="2"
            variant="flushed"
            borderColor="gray.300"
            placeholder="인증코드를 입력해주세요"
            as={InputMask}
            mask="999999"
            maskChar={null}
            value={inputCode}
            onChange={(e) => handleCodeChange(e.target.value)}
          />
        )} */}
      </Stack>
    </Box>
  );
};

export default PhoneVerification;
