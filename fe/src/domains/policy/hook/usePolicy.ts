import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { getPolicy, updatePolicy } from "../api/PolicyAPI";

interface Policy {
  id: number;
  policyName: string;
  value: number;
}

const usePolicy = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [policies, setPolicies] = useState<Policy[]>([]);

  const fetchPolicy = async () => {
    try {
      const data = await getPolicy();
      setPolicies(data);
      setIsAdmin(true);
      setLoading(true);
    } catch (error) {
      toast({
        title: "Error fetching policy",
        description: "Failed to load policy data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [toast]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPolicies = policies.map((policy) =>
      policy.policyName === e.target.name
        ? { ...policy, value: parseInt(e.target.value) }
        : policy
    );
    setPolicies(newPolicies);
  };

  const saveEditedPolicy = async (policy: Policy) => {
    try {
      await updatePolicy(policy.policyName, policy.value);
      toast({
        title: "Policy updated",
        description: "Policy values have been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating policy",
        description: "Failed to update policy values.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    loading,
    policies,
    isAdmin,
    handleValueChange,
    saveEditedPolicy,
  };
};

export default usePolicy;
