import React from "react";
import {
  Box,
  Text,
  Progress,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { CardType } from "../types/cardTypes";

interface CardTypeToggleProps {
  cardType: CardType;
  onToggle: () => void;
}

const CardTypeToggle: React.FC<CardTypeToggleProps> = ({
  cardType,
  onToggle,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box textAlign="center">
      <Progress
        value={50}
        size="sm"
        colorScheme="blackAlpha"
        borderRadius="full"
        mb={2}
        sx={{
          "& div": {
            transition: "all 0.3s ease-in-out",
            transform:
              cardType === "PUBLIC" ? "translateX(0)" : "translateX(100%)",
          },
        }}
      />
      <Button
        onClick={onToggle}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        bg="white"
        _hover={{ bg: "gray.100" }}
        size={isMobile ? "md" : "lg"}
      >
        <Text fontSize="lg">{cardType === "PUBLIC" ? "공개" : "원본"}</Text>
      </Button>
    </Box>
  );
};

export default CardTypeToggle;
