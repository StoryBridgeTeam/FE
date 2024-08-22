import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  useBreakpointValue,
  Text,
  Spinner,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { FiPlusCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useNavigate, useParams } from "react-router-dom";
import { POI, usePOI } from "../../poi/hooks/usePOI";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const AddButton: React.FC<{ isMobile: boolean; onClick: () => void }> =
  React.memo(({ isMobile, onClick }) => (
    <Box
      m={4}
      mt={isMobile ? 5 : 8}
      bg="white"
      color="black"
      h="5%"
      onClick={onClick}
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
  ));

const POIList: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { nickName } = useParams<{ nickName: string }>();
  const [pois, setPois] = useState<POI[]>([]);
  const { loading, error, fetchTitles, reorderPOIs, totalPages, currentPage } =
    usePOI();

  // 화면 너비에 따라 size를 결정
  const calculateSize = () => {
    const width = window.innerWidth;
    if (width < 768) return 4;
    else return 11;
  };

  const [size, setSize] = useState(calculateSize());

  useEffect(() => {
    const handleResize = () => {
      setSize(calculateSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (nickName) {
      fetchTitles(nickName, 0, size).then((data) => setPois(data));
    }
  }, [nickName, size]);

  const loadTitles = async (page = 0) => {
    try {
      const data = await fetchTitles(nickName!, page, size);
      setPois(data);
    } catch (err) {
      console.error("Failed to fetch poi titles", err);
    }
  };

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return;

      const newItems = Array.from(pois);
      const [reorderedItem] = newItems.splice(result.source.index, 1);
      newItems.splice(result.destination.index, 0, reorderedItem);

      setPois(newItems);

      const modifyList = newItems.map((item, index) => ({
        id: item.id as number,
        index: index + 1,
      }));

      try {
        if (nickName) {
          await reorderPOIs(nickName, modifyList);
        }
      } catch (error) {
        console.error("Failed to update POI indexes:", error);
      }
    },
    [pois, nickName, reorderPOIs]
  );

  const handleCreatePOI = useCallback(() => {
    if (nickName) {
      navigate(`/${nickName}/poi/create`);
    }
  }, [nickName, navigate]);

  const handleGetPOI = useCallback(
    (poiId: number) => {
      if (nickName) {
        navigate(`/${nickName}/poi/${poiId}`);
      }
    },
    [nickName, navigate]
  );

  const handlePageChange = (newPage: number) => {
    loadTitles(newPage);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <VStack
      spacing={4}
      align="stretch"
      bg="#F6F6F6"
      borderRadius="3xl"
      h="100%"
      w="100%"
      overflow="hidden"
      p={2}
      color="#CDCDCD"
      border={isMobile ? "" : "1px solid"}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="poi-list">
          {(provided) => (
            <Box
              h="100%"
              overflowY="auto"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {pois.map((item, index) => (
                <Draggable
                  key={item.id?.toString()}
                  draggableId={item.id?.toString() || ""}
                  index={index}
                >
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
                      onClick={() => handleGetPOI(item.id as number)}
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
              ))}
              {provided.placeholder}
              <AddButton
                isMobile={isMobile as boolean}
                onClick={handleCreatePOI}
              />
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      {totalPages <= 1 ? null : (
        <HStack justify="space-between" mt={4}>
          <IconButton
            aria-label="Previous Page"
            icon={<FaChevronLeft />}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 0}
            bg="#F6F6F6"
          />
          <Text>{`${currentPage + 1} / ${totalPages}`}</Text>
          <IconButton
            aria-label="Next Page"
            icon={<FaChevronRight />}
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages - 1}
            bg="#F6F6F6"
          />
        </HStack>
      )}
    </VStack>
  );
};

export default POIList;
