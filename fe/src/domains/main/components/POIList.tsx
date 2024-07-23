import React, { useState, useCallback, useMemo } from "react";
import { Box, useBreakpointValue, Text } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { FiPlusCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { mockData } from "../mainData";

const scrollbarStyle = css`
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

interface Item {
  id: number;
  title: string;
  content: string;
}

interface DraggableItemProps {
  item: Item;
  index: number;
  isMobile: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = React.memo(
  ({ item, index, isMobile }) => (
    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          m={4}
          bg="white"
          color="black"
          h="5%"
          shadow="md"
          borderRadius="3xl"
          onClick={() => {}}
          _hover={{ cursor: "pointer", bg: "gray.300" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid #CDCDCD"
          fontSize="sm"
          overflow="hidden"
          p={isMobile ? 4 : 0}
        >
          <Text isTruncated maxWidth="90%" px={2}>
            {item.title}
          </Text>
        </Box>
      )}
    </Draggable>
  )
);

const AddButton: React.FC<{ isMobile: boolean }> = React.memo(
  ({ isMobile }) => (
    <Box
      m={4}
      mt={8}
      bg="white"
      color="black"
      h="5%"
      onClick={() => {}}
      _hover={{ cursor: "pointer", bg: "gray.500" }}
      borderRadius="3xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      border="2px solid #CDCDCD"
      p={isMobile ? 4 : 0}
    >
      <FiPlusCircle />
    </Box>
  )
);

const POIList: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const [items, setItems] = useState<Item[]>(mockData);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const newItems = Array.from(items);
      const [reorderedItem] = newItems.splice(result.source.index, 1);
      newItems.splice(result.destination.index, 0, reorderedItem);
      setItems(newItems);
    },
    [items]
  );

  const memoizedItems = useMemo(
    () =>
      items.map((item, index) => (
        <DraggableItem
          key={item.id}
          item={item}
          index={index}
          isMobile={isMobile as boolean}
        />
      )),
    [items, isMobile]
  );

  return (
    <Box
      bg={isMobile ? "white" : "#F6F6F6"}
      borderRadius="3xl"
      h="100%"
      w={isMobile ? "80%" : "100%"}
      m={isMobile ? 4 : 0}
      overflow="hidden"
      p={2}
      color="#CDCDCD"
      border={isMobile ? "" : "1px solid"}
      shadow={isMobile ? "md" : ""}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="poi-list">
          {(provided) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              css={scrollbarStyle}
              h="100%"
              overflowY="auto"
            >
              {memoizedItems}
              {provided.placeholder}
              <AddButton isMobile={isMobile as boolean} />
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default POIList;
