import React from "react";
import { Input, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface IdInputProps {
  id: string;
  idError: string | null;
  handleIdChange: (value: string) => void;
}

const IdInput: React.FC<IdInputProps> = ({ id, idError, handleIdChange }) => {
  const { t, i18n } = useTranslation();

  const determineInputType = () => {
    return i18n.language === "ko" ? "tel" : "email";
  };

  const determineAutocomplete = () => {
    return i18n.language === "ko" ? "tel" : "username";
  };

  return (
    <>
      <Input
        type={determineInputType()}
        placeholder={t(`login.id`)}
        value={id}
        onChange={(e) => handleIdChange(e.target.value)}
        isInvalid={!!idError}
        autoComplete={determineAutocomplete()}
      />
      {idError && (
        <Text fontSize="sm" color="red.500">
          {idError}
        </Text>
      )}
    </>
  );
};

export default IdInput;
