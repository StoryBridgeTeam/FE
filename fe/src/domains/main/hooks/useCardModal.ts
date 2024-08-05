import { useState } from "react";
import { CardState, useCardStore } from "../stores/useCardStore";
import { DropResult } from "react-beautiful-dnd";

export const useCardModal = () => {
  const { cards, updateCard, addCard, removeCard, realignIds } = useCardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedCards, setEditedCards] = useState<CardState[]>([]);

  const handleEditMode = () => {
    setIsEditing(true);
    setEditedCards([...cards]);
  };

  const handleSave = () => {
    const newCards = editedCards.filter((card) => card.id < 0);
    const updatedCards = editedCards.filter((card) => card.id > 0);

    newCards.forEach((card) => {
      addCard({
        title: card.title,
        content: card.content,
        isVisibleBriefCard: card.isVisibleBriefCard,
      });
    });

    updatedCards.forEach((card) => {
      updateCard(card.id, card);
    });

    realignIds();
    setIsEditing(false);
    setEditedCards([]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedCards([]);
  };

  const handleCardChange = (id: number, updatedCard: Partial<CardState>) => {
    setEditedCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, ...updatedCard } : card))
    );
  };

  const handleAddNewCard = () => {
    const newCard: CardState = {
      id: -Date.now(), //임시값(음수)으로 설정
      title: "새 항목",
      content: "",
      isVisibleBriefCard: false,
    };
    setEditedCards((prev) => [...prev, newCard]);
  };

  const handleDeleteCard = (id: number) => {
    if (id > 0) {
      removeCard(id);
    }
    setEditedCards((prev) => prev.filter((card) => card.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(editedCards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedItems = items.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setEditedCards(reorderedItems);
  };

  return {
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
  };
};
