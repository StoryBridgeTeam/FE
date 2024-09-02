import React from "react";
import {Box, IconButton} from "@chakra-ui/react";
import {PlusSquareIcon} from "@chakra-ui/icons";

const AddButton: React.FC<{ isMobile: boolean; onClick: () => void }> =
  React.memo(({ isMobile, onClick }) => (
    <Box
      color="black"
      onClick={onClick}
      _hover={{ cursor: "pointer", bgColor:"gray.300"}}
      borderRadius="xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={isMobile ? 3 : 3}
    >
        <PlusSquareIcon />
    </Box>
  ));

export default AddButton;
