import { useEffect } from "react";
import { useSignUpStore } from "../stores/SignUpStore";
import { useVerificationStore } from "../stores/VerificationStore";
import { useStepsStore } from "../stores/StepsStore";
import { requestPhoneVerification } from "../api/auth";

export const usePhoneVerification = () => {
  const {
    name,
    gender,
    birth,
    phoneNumber,
    telecom,
    setName,
    setGender,
    setBirth,
    setPhoneNumber,
    setTelecom,
  } = useSignUpStore();
  const { setVerificationCode } = useVerificationStore();
  const { nextStep, setCondition } = useStepsStore();

  const handleNameChange = (inputName: string) => {
    setName(inputName);
  };

  const handleGenderChange = (inputGender: string) => {
    setGender(inputGender);
  };

  const handleBirthDateChange = (inputDate: string) => {
    setBirth(inputDate);
  };

  const handlePhoneNumberChange = (inputNumber: string) => {
    const numericValue = inputNumber.replace(/\D/g, "");
    setPhoneNumber(numericValue);
  };

  const handleTelecomChange = (selectTelecom: string) => {
    setTelecom(selectTelecom);
  };

  const isInputNameValid = (): boolean => {
    const nameRegex = /^[a-zA-Z가-힣\s]+$/;
    return nameRegex.test(name);
  };

  const isInputDateValid = (): boolean => {
    return birth.length === 8;
  };

  const isInputNumberValid = (): boolean => {
    return phoneNumber.length === 11;
  };

  const handleSendRequestPhone = async () => {
    // 인증코드 발송 API 호출, 이후 setVerificationCode에 저장
    try {
      const response = await requestPhoneVerification({
        phoneNumber,
        name,
        telCompany: telecom,
        birth,
        gender,
      });
      setVerificationCode(response.data.identityVerificationId);
      nextStep();
    } catch (error) {
      //에어로직 따로 추가하기
    }
  };

  const isInputValid = (): boolean => {
    return (
      isInputNameValid() &&
      isInputDateValid() &&
      isInputNumberValid() &&
      !!gender &&
      !!telecom
    );
  };

  useEffect(() => {
    setCondition(3, isInputValid());
  }, [name, gender, birth, phoneNumber, telecom, setCondition]);

  return {
    name,
    gender,
    birth,
    phoneNumber,
    telecom,
    handleNameChange,
    handleGenderChange,
    handleBirthDateChange,
    handlePhoneNumberChange,
    handleTelecomChange,
    handleSendRequestPhone,
    isInputNameValid,
    isInputNumberValid,
    isInputDateValid,
  };
};
