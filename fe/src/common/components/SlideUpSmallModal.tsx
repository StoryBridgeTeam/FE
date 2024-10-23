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
  footerContent?: React.ReactNode;
  headerLeft ?: React.ReactNode
}

export const SlideUpSmallModal: React.FC<SlideUpSmallModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  headerLeft
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      motionPreset="slideInBottom"
      size={isMobile ? "md" : "md"}
    >
      <ModalOverlay bg="blackAlpha.600" />
      {/*<ModalOverlay />*/}
      <ModalContent
        bg="white"
        borderTopRadius="3xl"
        boxShadow="lg"
        bottom={0}
        left={0}
        right={0}
        mt={isMobile ? "auto" : "70vh"} // Place at the bottom on mobile, middle on larger screens
        transform={isOpen ? "translateY(0)" : "translateY(100%)"}
        transition="transform 0.3s ease"
        p={isMobile ? 0 : 4}
        maxW={isMobile ? "100%" : "3xl"}
        mx={isMobile ? 0 : "auto"}
        h={isMobile ? "40vh" : "30vh"} // Adjust the height to 50% of the screen
        overflow="hidden"
        mb={0}
      >
        {title && (
          <ModalHeader fontSize="lg" fontWeight="bold" textAlign="center" position={"relative"} mt={2}>
            <Box position={"absolute"} top={4}>
              {headerLeft}
            </Box>
            {title}
            <ModalCloseButton _focus={{ boxShadow: "none" }} />
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
