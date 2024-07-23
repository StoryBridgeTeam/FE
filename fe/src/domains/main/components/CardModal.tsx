import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  Flex,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Edit, Check, Plus } from "tabler-icons-react";
import { useCardModal } from "../hooks/useCardModal";
import CardList from "./CardList";

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

interface ModalActionButtonsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onAddNew: () => void;
}

const ModalActionButtons: React.FC<ModalActionButtonsProps> = ({
  isEditing,
  onEdit,
  onSave,
  onAddNew,
}) => (
  <Flex m={2}>
    <Spacer />
    {isEditing ? (
      <Box mb={2}>
        <Button size="xs" mr={2} onClick={onAddNew}>
          <Plus size={12} color="black" />
        </Button>
        <Button size="xs" mr={2} onClick={onSave}>
          <Check size={12} color="black" />
        </Button>
      </Box>
    ) : (
      <Button size="xs" onClick={onEdit}>
        <Edit size={12} color="black" />
      </Button>
    )}
  </Flex>
);

const CardModal: React.FC<CardModalProps> = ({ isOpen, onClose, name }) => {
  const {
    cards,
    editedCards,
    isEditing,
    handleEditMode,
    handleSave,
    handleCancel,
    handleCardChange,
    handleAddNewCard,
    handleDeleteCard,
    onDragEnd,
  } = useCardModal();

  const handleModalClose = () => {
    handleCancel();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton onClick={handleModalClose} />
        <ModalBody>
          {isEditing && (
            <Text fontSize="sm" mb={4}>
              체크박스를 통해 메인페이지에 표시여부를 설정할 수 있습니다.
            </Text>
          )}
          <Box borderRadius="xl" mx={4} mb={12} border="1px dashed black">
            <ModalActionButtons
              isEditing={isEditing}
              onEdit={handleEditMode}
              onSave={handleSave}
              onAddNew={handleAddNewCard}
            />
            <CardList
              cards={isEditing ? editedCards : cards}
              isEditing={isEditing}
              onCardChange={handleCardChange}
              onDeleteCard={handleDeleteCard}
              onDragEnd={onDragEnd}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CardModal;
