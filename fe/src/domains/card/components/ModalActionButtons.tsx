import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { Check, Edit, Plus } from "tabler-icons-react";
import { useCardEdit } from "../hooks/useCardEdit";
import { CardType } from "../types/cardTypes";
import { useCardStore } from "../stores/cardStore";

interface ModalActionButtonsProps {
  cardType: CardType;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const ModalActionButtons: React.FC<ModalActionButtonsProps> = ({
  cardType,
  isEditing,
  setIsEditing,
}) => {
  const {
    tempEntries,
    handleAddTempEntry,
    copyCardToTemp,
    handleUpdateOriginalCard,
    handleUpdatePublicCard,
  } = useCardEdit();
  const { hasCard } = useCardStore();

  const onEdit = () => {
    setIsEditing(true);
    copyCardToTemp(cardType);
  };

  const onSave = () => {
    setIsEditing(false);
    if (!hasCard) {
      return;
    }
    if (cardType === "public") {
      handleUpdatePublicCard();
    } else {
      handleUpdateOriginalCard();
    }
  };

  const onAddNew = () => {
    handleAddTempEntry();
  };

  return (
    <Flex m={2}>
      <Spacer />
      {isEditing ? (
        <Box mb={2}>
          <Button size="xs" mr={2} onClick={onAddNew} bg="#C9C9C9">
            <Plus size={20} color="black" />
          </Button>
          <Button size="xs" mr={2} onClick={onSave} bg="#C9C9C9">
            <Check size={20} color="black" />
          </Button>
        </Box>
      ) : (
        <Button size="xs" onClick={onEdit} bg="#C9C9C9">
          <Edit size={20} color="black" />
        </Button>
      )}
    </Flex>
  );
};

export default ModalActionButtons;
