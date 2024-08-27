import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Button,
} from "@chakra-ui/react";
import { FirstCardModalProps, EntryState } from "../types/cardTypes";
import React, { useEffect } from "react";
import { useCard } from "../hooks/useCard";
import ModalActionButtons from "./ModalActionButton";
import CardModalList from "./CardModalList";
import { use } from "i18next";

//첫번째 카드생성을 위한 모달창
const FirstCardModal: React.FC<FirstCardModalProps> = ({
  isOpen,
  onClose,
  nickName,
}) => {
  const { createNewCard } = useCard();
  const [isEditing, setIsEditing] = React.useState<boolean>(true);
  const [newEntries, setNewEntries] = React.useState<EntryState[]>([]);

  const handleModalClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    createNewCard(nickName, newEntries);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={3} textAlign="center">
          <Text fontSize="2xl" as="b">
            명함카드를 만들어보세요!
          </Text>
        </ModalHeader>
        <ModalCloseButton onClick={handleModalClose} />
        <ModalBody display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="sm" mb={4} textAlign="center">
            체크박스를 통해 메인페이지에 표시여부를 설정할 수 있습니다
          </Text>

          <Box
            borderRadius="xl"
            mx={{ base: 0, md: 4 }}
            mb={6}
            border={{ base: 0, md: "1px dashed black" }}
            width="100%"
          >
            <ModalActionButtons
              cardType={"NEW"}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              nickName={nickName}
              entries={newEntries}
              setEntries={setNewEntries}
            />
            <CardModalList
              isEditing={isEditing}
              entries={newEntries}
              setEntries={setNewEntries}
            />
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" onClick={handleSubmit}>
            카드 생성하기!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FirstCardModal;
