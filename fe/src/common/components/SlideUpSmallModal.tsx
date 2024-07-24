import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  useBreakpointValue,
  ModalFooter,
} from "@chakra-ui/react";

interface SlideUpSmallModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode; // Optional footer content
}

export const SlideUpSmallModal: React.FC<SlideUpSmallModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      size={isMobile ? "full" : "md"}
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        bg="white"
        borderTopRadius="3xl"
        boxShadow="lg"
        bottom={0}
        left={0}
        right={0}
        mt={isMobile ? 0 :"50vh"}
        transform={isOpen ? "translateY(0)" : "translateY(100%)"}
        transition="transform 0.3s ease"
        p={4}
        maxW={isMobile ? "100%" : "3xl"}
        mx={isMobile ? 0 : "auto"}
        h="50vh"
        overflow="hidden"
        mb={0}
      >
        <ModalCloseButton _focus={{ boxShadow: "none" }} mt={2} mr={2} />
        {title && (
          <ModalHeader fontSize="lg" fontWeight="bold" textAlign="center">
            {title}
          </ModalHeader>
        )}
        <ModalBody
          display="flex"
          flexDirection="column"
          h="calc(100% - 70px)"
          overflowY="auto"
          pt={8}
        >
          <Box>{children}</Box>
        </ModalBody>
        {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};
