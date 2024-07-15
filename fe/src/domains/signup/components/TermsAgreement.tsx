import { Box, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTermsStore } from "../stores/useTermsStore";
import TermItem from "./TermItem";
import { useStepsStore } from "../stores/useStepsStore";

const TermsAgreement = () => {
  const { t } = useTranslation();
  const { agreements, handleAgreeAll, handleAgreeChange } = useTermsStore();
  const { setCondition } = useStepsStore();

  interface Term {
    name: keyof typeof agreements;
    label: string;
    required: boolean;
  }

  const terms: Term[] = [
    {
      name: "agreeRequired1",
      label: t("signup.TermsAgreement.agreeRequired1"),
      required: true,
    },
    {
      name: "agreeRequired2",
      label: t("signup.TermsAgreement.agreeRequired2"),
      required: true,
    },
    {
      name: "agreeOptional1",
      label: t("signup.TermsAgreement.agreeOptional1"),
      required: false,
    },
    {
      name: "agreeOptional2",
      label: t("signup.TermsAgreement.agreeOptional2"),
      required: false,
    },
  ];

  useEffect(() => {
    if (agreements["agreeRequired1"] && agreements["agreeRequired2"]) {
      setCondition(2, true);
    } else {
      setCondition(2, false);
    }
  }, [agreements]);

  return (
    <Box>
      <Text fontSize="xl" fontWeight="800" mt={6} mb={14} textAlign="left">
        {t("signup.TermsAgreement.title")}
      </Text>
      <Stack spacing={5} mt={4}>
        <TermItem
          isChecked={Object.values(agreements).every(Boolean)}
          onChange={handleAgreeAll}
          hasDetail={false}
        >
          {t("signup.TermsAgreement.agreeAll")}
        </TermItem>
        <hr />

        {terms.map((term) => (
          <TermItem
            key={term.name}
            isChecked={agreements[term.name]}
            onChange={() => handleAgreeChange(term.name)}
            hasDetail={true}
          >
            {term.label}
          </TermItem>
        ))}
      </Stack>
    </Box>
  );
};

export default TermsAgreement;
