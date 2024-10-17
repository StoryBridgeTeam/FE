import React from "react";
import {UnorderedList, Flex, Box, Text, VStack} from "@chakra-ui/react";
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
    name,
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
              <Box px={10} paddingBottom={10} paddingTop={5}>
                <Text fontSize={"2xl"} fontWeight="bold">
                  {name}
                </Text>
                <VStack px={1} gap={1} w={"100%"} alignItems={"start"} paddingY={10} borderBottom={"2px solid gray"}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="entries">
                      {(provided) => (
                          <Box
                              w={"100%"}
                              {...provided.droppableProps}
                              ref={provided.innerRef}
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
                                          w={"100%"}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          // mb={2}
                                          p={1}
                                          borderWidth="1px"
                                          borderRadius="lg"
                                          justifyContent={"space-between"}
                                          alignItems="center"
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
                          </Box>
                      )}
                    </Droppable>
                  </DragDropContext>
                </VStack>
              </Box>
      ) : (
        <Box px={10} paddingBottom={10} paddingTop={5}>
          <Text fontSize={"2xl"} fontWeight="bold">
            {name}
          </Text>
          <VStack
              px={1} gap={1} w={"100%"} alignItems={"start"} paddingY={10} borderBottom={"2px solid gray"}>
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
          </VStack>
        </Box>
      )}
    </>
  );
};

export default CardModalList;
