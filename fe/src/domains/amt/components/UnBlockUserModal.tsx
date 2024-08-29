import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
} from "@chakra-ui/react";

interface UnblockUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UnblockUserModal: React.FC<UnblockUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Unblock User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>차단해제하시겠습니까?</Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="red" onClick={onConfirm}>
            차단해제
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UnblockUserModal;
