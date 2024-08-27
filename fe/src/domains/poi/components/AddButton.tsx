import React from "react";
import { Box } from "@chakra-ui/react";

const AddButton: React.FC<{ isMobile: boolean; onClick: () => void }> =
  React.memo(({ isMobile, onClick }) => (
    <Box
      mt={2}
      ml={4}
      mr={4}
      bg="white"
      color="black"
      h="10%"
      onClick={onClick}
      _hover={{ cursor: "pointer", bg: "gray.500" }}
      borderRadius="xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="2px solid #ababab"
      p={isMobile ? 4 : 0}
    >
      POI 작성하기
    </Box>
  ));

export default AddButton;
