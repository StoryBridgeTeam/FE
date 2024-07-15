import { useState, useEffect } from "react";
import { useStepsStore } from "../stores/useStepsStore";
import { usePhoneVerificationStore } from "../stores/usePhoneVerificationStore";
import { useVerificationCodeStore } from "../stores/useVerificationCodeStore";

export const usePhoneVerification = () => {
  const { nextStep } = useStepsStore();
  const {
    username,
    phoneNumber,
    telecom,
    setUsername,
    setPhoneNumber,
    setTelecom,
  } = usePhoneVerificationStore();
  //useLoginForm처럼 같이 쓰이는 것들은 한번에 입력받자. 타입스크립트의 장점활용하자.
  const { verificationCode, setVerficationCode } = useVerificationCodeStore();
  const { setCondition } = useStepsStore();

  const [inputName, setInputName] = useState("");
  const [inputNumber, setInputNumber] = useState("");
  const [inputTelecom, setInputTelecom] = useState("");

  const [inputCode, setInputCode] = useState("");
  // const handleNameChange = (inputName: string) => {
  //   setInputName(inputName);
  // };

  // const handlePhoneNumberChange = (inputNumber: string) => {
  //   setInputNumber(inputNumber);
  // };

  // const handleCodeChange = (inputCode: string) => {
  //   setInputCode(inputCode);
  // };

  //요청보내기와 같은이름으로 바꾸는게 좋나??
  const handleSendCode = () => {
    setInputNumber(inputNumber.replace(/-/g, "")); // 하이픈 제거

    if (inputName && inputNumber && telecom) {
      // 인증코드 발송 API 호출, d이후 setVerficationCode에 저장
    }
  };

  const isInputNameValid = (): boolean => {
    const nameRegex = /^[a-zA-Z가-힣]+$/;
    return nameRegex.test(inputName) && inputNumber !== "";
  };

  const isInputNumberValid = (): boolean => {
    setInputNumber(inputNumber.replace(/-/g, "")); // 하이픈 제거
    return inputNumber.length === 11;
  };

  const handleVerification = () => {
    nextStep();

    //비동기처리할것
    if (inputCode === verificationCode) {
      setUsername(inputName);
      setPhoneNumber(inputNumber);

      // nextStep();
    }
  };

  useEffect(() => {
    if (
      isInputNameValid() &&
      isInputNumberValid() &&
      (telecom === "SKT" || telecom === "KT" || telecom === "LGU")
    ) {
      setCondition(3, true);
    } else {
      setCondition(3, false);
    }
  }, [inputName, inputNumber, telecom]);

  return {
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
    handleVerification,
    setTelecom,
  };
};
