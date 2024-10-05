import { Box, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSignUpStore } from "../stores/SignUpStore";
import TermItem from "./TermItem";
import { useStepsStore } from "../stores/StepsStore";

const TermsAgreement = () => {
  const { t } = useTranslation();
  const { agreements, setAgreement, setAllAgreements } = useSignUpStore();
  const { setCondition } = useStepsStore();

  interface Term {
    name: keyof typeof agreements;
    label: string;
    detailPath : string
  }

  const terms: Term[] = [
    {
      name: "required1",
      label: t("signup.TermsAgreement.agreeRequired1"),
      detailPath : "/policy/service"
    },
    {
      name: "required2",
      label: t("signup.TermsAgreement.agreeRequired2"),
      detailPath : "/policy/privacy"
    },
  ];

  const handleAgreeAll = () => {
    const allChecked = Object.values(agreements).every(Boolean);
    setAllAgreements(!allChecked);
  };

  const handleAgreeChange = (name: keyof typeof agreements) => {
    setAgreement(name, !agreements[name]);
  };

  useEffect(() => {
    if (agreements.required1 && agreements.required2) {
      setCondition(2, true);
    } else {
      setCondition(2, false);
    }
  }, [agreements, setCondition]);

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
          title={t("signup.TermsAgreement.agreeAll")}
        />
        <hr />

        {terms.map((term) => (
          <TermItem
            key={term.name}
            isChecked={agreements[term.name]}
            onChange={() => handleAgreeChange(term.name)}
            hasDetail={true}
            title={term.label}
            detailPath={term.detailPath}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default TermsAgreement;
