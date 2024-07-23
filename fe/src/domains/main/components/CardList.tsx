import React from "react";
import { UnorderedList, Flex, Box } from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { GripVertical } from "tabler-icons-react";
import CardModalItem from "./CardModalItem";
import { CardState } from "../stores/useCardStore";

interface CardListProps {
  cards: CardState[];
  isEditing: boolean;
  onCardChange: (id: number, updatedCard: Partial<CardState>) => void;
  onDeleteCard: (id: number) => void;
  onDragEnd: (result: DropResult) => void;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  isEditing,
  onCardChange,
  onDeleteCard,
  onDragEnd,
}) => {
  if (!isEditing) {
    return (
      <UnorderedList styleType="none" px={8} pb={10} spacing={2}>
        {cards.map((card) => (
          <CardModalItem
            key={card.id}
            card={card}
            isEditing={isEditing}
            onCardChange={(updatedCard) => onCardChange(card.id, updatedCard)}
            onDeleteCard={() => onDeleteCard(card.id)}
          />
        ))}
      </UnorderedList>
    );
  } else {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="cards">
          {(provided) => (
            <UnorderedList
              {...provided.droppableProps}
              ref={provided.innerRef}
              styleType="none"
              px={8}
              pb={10}
              spacing={4}
            >
              {cards.map((card, index) => (
                <Draggable
                  key={card.id}
                  draggableId={card.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <Flex
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      alignItems="center"
                    >
                      <Box
                        {...provided.dragHandleProps}
                        cursor="move"
                        mr={2}
                        ml={-4}
                      >
                        <GripVertical size={16} color="gray" />
                      </Box>
                      <CardModalItem
                        card={card}
                        isEditing={isEditing}
                        onCardChange={(updatedCard) =>
                          onCardChange(card.id, updatedCard)
                        }
                        onDeleteCard={() => onDeleteCard(card.id)}
                      />
                    </Flex>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </UnorderedList>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
};

export default CardList;
