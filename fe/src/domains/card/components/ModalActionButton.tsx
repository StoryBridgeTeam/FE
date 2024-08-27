import React from "react";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { Check, Edit, Plus } from "tabler-icons-react";
import { EntryState, ModalElementProps } from "../types/cardTypes";
import { useCard } from "../hooks/useCard";

const ModalActionButtons: React.FC<ModalElementProps> = ({
  cardType,
  isEditing,
  nickName,
  entries,
  setIsEditing,
  setEntries,
}) => {
  const { editOriginalCard, editPublicCard } = useCard();

  const onEdit = () => {
    setIsEditing(true);
  };

  const onSave = () => {
    setIsEditing(false);
    if (cardType === "NEW") {
      // editPublicCard(nickName, entries);
      // editOriginalCard(nickName, entries);
    } else if (cardType === "PUBLIC") {
      editPublicCard(nickName, entries);
    } else if (cardType === "ORIGINAL") {
      editOriginalCard(nickName, entries);
    }
  };

  const onAddNew = () => {
    setEntries([
      ...entries,
      {
        id: -Date.now(),
        title: "",
        content: "",
        index: entries.length,
        isVisibleBriefCard: true,
      },
    ]);
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
