import { useState, useEffect } from "react";
import { useStepsStore } from "../stores/useStepsStore";
import { usePhoneVerificationStore } from "../stores/usePhoneVerificationStore";
import { useVerificationCodeStore } from "../stores/useVerificationCodeStore";

export const usePhoneVerification = () => {
  const { nextStep, setCondition } = useStepsStore();
  const {
    username,
    gender,
    birthDate,
    phoneNumber,
    telecom,
    setUsername,
    setGender,
    setBirthDate,
    setPhoneNumber,
    setTelecom,
  } = usePhoneVerificationStore();
  const { setVerficationCode } = useVerificationCodeStore();

  const handleNameChange = (inputName: string) => {
    setUsername(inputName);
  };

  const handleGenderChange = (inputGender: string) => {
    setGender(inputGender);
  };

  const handleBirthDateChange = (inputDate: string) => {
    setBirthDate(inputDate);
  };

  const handlePhoneNumberChange = (inputNumber: string) => {
    const numericValue = inputNumber.replace(/\D/g, ""); //하이푼 제거
    setPhoneNumber(numericValue);
  };

  const handleTelecomChange = (selectTelecom: string) => {
    setTelecom(selectTelecom);
  };

  const isInputNameValid = (): boolean => {
    const nameRegex = /^[a-zA-Z가-힣\s]+$/;

    return nameRegex.test(username);
  };

  const isInputDateValid = (): boolean => {
    return birthDate.length === 8;
  };

  const isInputNumberValid = (): boolean => {
    return phoneNumber.length === 11;
  };

  const handleSendRequestPhone = () => {
    // 인증코드 발송 API 호출, d이후 setVerficationCode에 저장
    setVerficationCode("123456");
    nextStep();
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
    if (isInputValid()) {
      setCondition(3, true);
      console.log(username + gender + birthDate + phoneNumber + telecom);
    } else {
      setCondition(3, false);
    }
  }, [username, gender, birthDate, phoneNumber, telecom]);

  return {
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
    handleSendRequestPhone,
    isInputNameValid,
    isInputNumberValid,
    isInputDateValid,
  };
};

// import { useState, useEffect } from "react";
// import { useStepsStore } from "../stores/useStepsStore";
// import { usePhoneVerificationStore } from "../stores/usePhoneVerificationStore";
// import { useVerificationCodeStore } from "../stores/useVerificationCodeStore";

// interface inputVerificationValues {
//   name: string;
//   number: string;
//   telecom: string;
// }

// export const usePhoneVerification = () => {
//   const { nextStep, setCondition } = useStepsStore();
//   const { setUsername, setPhoneNumber, setTelecom } =
//     usePhoneVerificationStore();

//   const { setVerficationCode } = useVerificationCodeStore();

//   const [values, setValues] = useState<inputVerificationValues>({
//     name: "",
//     number: "",
//     telecom: "",
//   });

//   const handleNameChange = (value: string) => {
//     setValues((prev) => ({
//       ...prev,
//       name: value,
//     }));
//   };

//   const handlePhoneNumberChange = (value: string) => {
//     setValues((prev) => ({
//       ...prev,
//       number: value,
//     }));
//   };

//   const handleTelecomChange = (value: string) => {
//     setValues((prev) => ({
//       ...prev,
//       telecom: value,
//     }));
//   };

//   const isInputNameValid = (): boolean => {
//     const nameRegex = /^[a-zA-Z가-힣\s]+$/;
//     return nameRegex.test(values.name) && values.number !== "";
//   };

//   const isInputNumberValid = (): boolean => {
//     return values.number.length === 13; // 010-1234-5678
//   };

//   const handleSendRequestPhone = () => {
//     // 인증코드 발송 API 호출, d이후 setVerficationCode에 저장
//     setVerficationCode("123456");
//     nextStep();
//   };

//   useEffect(() => {
//     if (isInputNameValid() && isInputNumberValid() && !!values.telecom) {
//       setUsername(values.name);
//       setPhoneNumber(values.number.replace(/-/g, "")); // 하이픈 제거
//       setTelecom(values.telecom);
//       setCondition(3, true);
//     } else {
//       setCondition(3, false);
//     }
//   }, [values.name, values.number, values.telecom]);

//   return {
//     inputs: values,
//     handleNameChange,
//     handlePhoneNumberChange,
//     handleTelecomChange,
//     handleSendRequestPhone,
//   };
// };
