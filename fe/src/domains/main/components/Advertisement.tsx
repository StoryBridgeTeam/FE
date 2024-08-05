import React from "react";
import { VStack, Box, Text, useBreakpointValue } from "@chakra-ui/react";

const Advertisement: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Box
      bg="#F6F6F6"
      borderRadius="3xl"
      w="100%"
      h="100%"
      p={6}
      color="#CDCDCD"
      border={isMobile ? "" : "1px solid"}
    >
      <VStack spacing={4} align="stretch" width="100%" height="100%">
        <Box bg="#E9E9E9" borderRadius="md" height="22%" width="100%">
          <Text color="gray.500" textAlign="center">
            광고
          </Text>
        </Box>
        <Box bg="#E9E9E9" borderRadius="md" height="22%" width="100%">
          <Text color="gray.500" textAlign="center">
            광고
          </Text>
        </Box>
        <Box bg="#E9E9E9" borderRadius="md" height="22%" width="100%">
          <Text color="gray.500" textAlign="center">
            광고
          </Text>
        </Box>
        <Box bg="#E9E9E9" borderRadius="md" height="22%" width="100%">
          <Text color="gray.500" textAlign="center">
            광고
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Advertisement;
