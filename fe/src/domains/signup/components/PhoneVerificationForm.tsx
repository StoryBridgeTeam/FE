import { Box, Stack, Text, Input, Select, InputGroup } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { usePhoneVerification } from "../hooks/usePhoneVerification";
import InputMask from "react-input-mask";

const PhoneVerificationForm = () => {
  const { t } = useTranslation();
  const {
    username,
    gender,
    birthDate,
    phoneNumber,
    telecom,
    handleNameChange,
    handleGenderChange,
    handleBirthDateChange,
    handlePhoneNumberChange,
    handleTelecomChange,
    isInputNameValid,
    isInputNumberValid,
    isInputDateValid,
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
          placeholder="성명"
          value={username}
          onChange={(e) => handleNameChange(e.target.value)}
        />

        <InputGroup>
          <Select
            ml="2"
            width="30%"
            value={gender}
            variant="flushed"
            onChange={(e) => handleGenderChange(e.target.value)}
          >
            <option value="" disabled style={{ color: "gray" }}>
              성별
            </option>
            <option value="male">남성</option>
            <option value="felmale">여성</option>
          </Select>
          <Input
            ml="2"
            isInvalid={birthDate !== "" && !isInputDateValid()}
            variant="flushed"
            borderColor="gray.300"
            placeholder="생년월일 8자리"
            as={InputMask}
            mask="99999999"
            maskChar={null}
            value={birthDate}
            onChange={(e) => handleBirthDateChange(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <Select
            ml="2"
            width="30%"
            value={telecom}
            variant="flushed"
            onChange={(e) => handleTelecomChange(e.target.value)}
          >
            <option value="" disabled style={{ color: "gray" }}>
              통신사
            </option>
            <option value="SKT">SKT</option>
            <option value="KT">KT</option>
            <option value="LGU+">LG U+</option>
          </Select>
          <Input
            ml="2"
            isInvalid={phoneNumber !== "" && !isInputNumberValid()}
            variant="flushed"
            borderColor="gray.300"
            type="tel"
            placeholder="전화번호"
            as={InputMask}
            mask="999-9999-9999"
            maskChar={null}
            value={phoneNumber}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
          />
        </InputGroup>
      </Stack>
    </Box>
  );
};

export default PhoneVerificationForm;
