import React from "react";
import {
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useBreakpointValue,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import useAdminPolicy from "../hook/useAdminPolicy";
import { useTranslation } from "react-i18next";

const AdminPolicyList: React.FC = () => {
  const { loading, policies, isAdmin, handleValueChange, saveEditedPolicy } =
    useAdminPolicy();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();

  if (loading) {
    return <Spinner />;
  }

  return (
    <Flex justifyContent="center" p={7}>
      <VStack spacing={4} align="stretch" width="100%">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={10}
          align="center"
          color={isAdmin ? "black" : "red"}
        >
          {isAdmin
            ? t("policy.AdminPolicyList.pageTitle")
            : t("policy.AdminPolicyList.wrongAccess")}
        </Text>
        {isAdmin &&
          policies.map((policy) => {
            const policyKey = policy.policyName;
            return (
              <VStack key={policy.id} spacing={2} align="stretch">
                <HStack spacing={4} align="center">
                  <Text width="80%" fontWeight="bold">
                    {t(`policy.PolicyList.${policyKey}.name`)}
                  </Text>
                  <Input
                    type="number"
                    name={policyKey}
                    value={policy.value}
                    onChange={handleValueChange}
                    width={isMobile ? "15%" : "10%"}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={() => saveEditedPolicy(policy)}
                    width="10%"
                  >
                    save
                  </Button>
                </HStack>
                <Text fontSize="sm" color="gray.600" mb={5}>
                  {t(`policy.PolicyList.${policyKey}.description`)}
                </Text>
              </VStack>
            );
          })}
      </VStack>
    </Flex>
  );
};

export default AdminPolicyList;
