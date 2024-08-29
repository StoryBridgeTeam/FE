import React from "react";
import { UnorderedList, Flex, Box, Text } from "@chakra-ui/react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { CardModalListProps, EntryState } from "../types/cardTypes";
import CardModalItem from "./CardModalItem";
import { GripVertical } from "tabler-icons-react";

const CardModalList: React.FC<CardModalListProps> = ({
  isEditing,
  entries = [],
  setEntries,
}) => {
  const reorderEntries = (startIndex: number, endIndex: number) => {
    const result = Array.from(entries);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    const reindexedEntries = result.map((entry, index) => ({
      ...entry,
      index,
    }));

    setEntries(reindexedEntries);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderEntries(result.source.index, result.destination.index);
  };

  const handleEntryChange = (id: number, updatedEntry: Partial<EntryState>) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    );
    setEntries(updatedEntries);
  };

  const handleEntryDelete = (id: number) => {
    const filteredEntries = entries
      .filter((entry) => entry.id !== id)
      .map((entry, index) => ({ ...entry, index }));
    setEntries(filteredEntries);
  };

  return (
    <>
      {entries.length === 0 ? (
        <Box px={10} pb={10} textAlign="center">
          <Text color="gray.500" fontSize="lg">
            빈 명함입니다
          </Text>
        </Box>
      ) : isEditing ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="entries">
            {(provided) => (
              <UnorderedList
                {...provided.droppableProps}
                ref={provided.innerRef}
                styleType="none"
                px={{ base: 0, md: 20 }}
                pb={{ base: 0, md: 10 }}
                spacing={2}
                maxHeight="400px"
                overflowY="auto"
                width="100%"
              >
                {entries.map((entry, index) => (
                  <Draggable
                    key={
                      entry.id !== null ? entry.id.toString() : `temp-${index}`
                    }
                    draggableId={
                      entry.id !== null ? entry.id.toString() : `temp-${index}`
                    }
                    index={index}
                  >
                    {(provided) => (
                      <Flex
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        mb={2}
                        p={3}
                        borderWidth="1px"
                        borderRadius="lg"
                        alignItems="center"
                        bg="gray.100"
                      >
                        <GripVertical />
                        <CardModalItem
                          key={
                            entry.id !== null
                              ? entry.id.toString()
                              : `temp-${index}`
                          }
                          entry={entry}
                          isEditing={isEditing}
                          onChangeEntry={handleEntryChange}
                          onDeleteEntry={handleEntryDelete}
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
      ) : (
        <Box px={10}>
          <UnorderedList
            styleType="disc"
            px={{ base: 0, md: 8 }}
            pb={{ base: 0, md: 10 }}
            spacing={2}
            maxHeight="400px"
            overflowY="auto"
          >
            {entries.map((entry) => (
              <CardModalItem
                key={
                  entry.id !== null
                    ? entry.id.toString()
                    : `temp-${entry.index}`
                }
                entry={entry}
                isEditing={isEditing}
                onChangeEntry={handleEntryChange}
                onDeleteEntry={handleEntryDelete}
              />
            ))}
          </UnorderedList>
        </Box>
      )}
    </>
  );
};

export default CardModalList;
