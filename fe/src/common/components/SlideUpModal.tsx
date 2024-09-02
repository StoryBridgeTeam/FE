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

interface SlideUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footerContent?: React.ReactNode; // Optional footer content
}

export const SlideUpModal: React.FC<SlideUpModalProps> = ({
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
      size={isMobile ? "xl" : "md"}
    >
      {/*<ModalOverlay bg="blackAlpha.600" />*/}
      <ModalOverlay />
      <ModalContent
        bg="white"
        borderTopRadius="3xl"
        boxShadow="lg"
        bottom={0}
        left={0}
        right={0}
        mt={isMobile ? "20vh" : "20vh"}
        transform={isOpen ? "translateY(0)" : "translateY(100%)"}
        transition="transform 0.3s ease"
        p={4}
        maxW={isMobile ? "100%" : "3xl"}
        mx={isMobile ? 0 : "auto"}
        h="80vh"
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

{
  /* <SlideUpModal
isOpen={isConnectOpen}
onClose={onConnectClose}
title="Connect Comment"
footerContent={
  <>
   footer
  </>
}
>
body
</SlideUpModal> */
}
// 이런식으로 사용
