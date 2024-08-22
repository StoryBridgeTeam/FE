import React from "react";
import { UnorderedList, Flex, Box, Container } from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { GripVertical } from "tabler-icons-react";
import CardModalItem from "./CardModalItem";
import { CardType } from "../types/cardTypes";
import { useCardStore } from "../stores/cardStore";
import { useTempStore } from "../stores/tempStore";
import { useCardEdit } from "../hooks/useCardEdit";

interface EntryListProps {
  cardType: CardType;
  isEditing: boolean;
}

//카드모달창 편집상태시 보여지는 컴포넌트
const CardModalList: React.FC<EntryListProps> = ({ cardType, isEditing }) => {
  const { publicEntries, originalEntries, hasCard } = useCardStore();
  const { tempEntries, reorderEntries } = useTempStore();
  const entries = cardType === "public" ? publicEntries : originalEntries;

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderEntries(result.source.index, result.destination.index);
  };

  return isEditing ? (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tempEntries">
        {(provided) => (
          <UnorderedList
            styleType="none"
            px={{ base: 0, md: 8 }}
            pb={{ base: 0, md: 10 }}
            spacing={4}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {tempEntries.map((entry, index) => (
              <Draggable
                key={entry.id}
                draggableId={entry.id.toString()}
                index={index}
              >
                {(provided) => (
                  <Container maxWidth="container.md" centerContent>
                    <Flex
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      alignItems="center"
                      width="80%"
                    >
                      <Box {...provided.dragHandleProps}>
                        <GripVertical size={20} />
                      </Box>
                      <Box flex={1}>
                        <CardModalItem entry={entry} isEditing={isEditing} />
                      </Box>
                    </Flex>
                  </Container>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </UnorderedList>
        )}
      </Droppable>
    </DragDropContext>
  ) : (
    <Box px={10}>
      <UnorderedList
        styleType="disc"
        px={{ base: 0, md: 8 }}
        pb={{ base: 0, md: 10 }}
        spacing={2}
      >
        {hasCard
          ? entries.map((entry) => (
              <CardModalItem entry={entry} isEditing={isEditing} />
            ))
          : tempEntries.map((entry) => (
              <CardModalItem entry={entry} isEditing={isEditing} />
            ))}
      </UnorderedList>
    </Box>
  );
};
export default CardModalList;
