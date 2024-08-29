import React from "react";
import { Box, Button } from "@chakra-ui/react";

interface CardCommentToggleProps {
  activeTab: "명함" | "댓글";
  setActiveTab: (tab: "명함" | "댓글") => void;
}

const CardCommentToggle: React.FC<CardCommentToggleProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <Box
      bg="white"
      p={1}
      borderRadius="xl"
      shadow="xs"
      width="fit-content"
      mx="auto"
      cursor="pointer"
    >
      <Button
        onClick={() => setActiveTab("명함")}
        bg={activeTab === "명함" ? "white" : "transparent"}
        color={activeTab === "명함" ? "black" : "gray.500"}
        _hover={{ bg: "gray.100" }}
        _focus={{ boxShadow: "none" }}
        borderRadius="2xl"
        px={4}
        fontWeight={activeTab === "명함" ? "bold" : "normal"}
      >
        명함
      </Button>
      <Button
        onClick={() => setActiveTab("댓글")}
        bg={activeTab === "댓글" ? "white" : "transparent"}
        color={activeTab === "댓글" ? "black" : "gray.500"}
        _hover={{ bg: "gray.100" }}
        _focus={{ boxShadow: "none" }}
        borderRadius="2xl"
        px={4}
        fontWeight={activeTab === "댓글" ? "bold" : "normal"}
      >
        댓글
      </Button>
    </Box>
  );
};

export default CardCommentToggle;
