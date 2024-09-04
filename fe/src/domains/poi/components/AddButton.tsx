import React from "react";
import {Box, IconButton} from "@chakra-ui/react";
import {PlusSquareIcon} from "@chakra-ui/icons";

const AddButton: React.FC<{ isMobile: boolean; onClick: () => void }> =
  React.memo(({ isMobile, onClick }) => (
    <Box
      color="black"
      onClick={onClick}
      _hover={{ cursor: "pointer", bgColor:"gray.200"}}
      borderRadius="5"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={isMobile ? 4 : 2.5}
      mx={4}
    >
        <PlusSquareIcon />
    </Box>
  ));

export default AddButton;
