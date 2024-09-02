import React, { useEffect } from "react";
import { VStack, Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { useAdStore } from "../stores/AdStore";

const AdComponent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { ads, fetchAds } = useAdStore();

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return (
    <Box
      bg="#F6F6F6"
      borderRadius="3xl"
      w="100%"
      minWidth={"200px"}
      maxWidth={"330px"}
      h="100%"
      p={6}
      color="#CDCDCD"
      border={isMobile ? "" : "1px solid"}
    >
      <VStack spacing={4} align="stretch" width="100%" height="100%">
        {ads.map((ad) => (
          <Box
            key={ad.id}
            bg="#E9E9E9"
            borderRadius="md"
            height="22%"
            width="100%"
          >
            <Text color="gray.500" textAlign="center">
              {ad.content}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default AdComponent;
