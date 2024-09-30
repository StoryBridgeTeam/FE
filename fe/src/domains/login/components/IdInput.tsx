import React from "react";
import { Input, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface IdInputProps {
  id: string;
  idError: string | null;
  handleIdChange: (value: string) => void;
  type:string
}

const IdInput: React.FC<IdInputProps> = ({ id, idError, handleIdChange, type}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Input
        type={type}
        placeholder={type=="tel" ? t(`login.id.tel`) : t('login.id.email')}
        value={id}
        onChange={(e) => handleIdChange(e.target.value)}
        isInvalid={!!idError}
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
