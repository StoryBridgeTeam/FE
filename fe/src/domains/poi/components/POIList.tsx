import React, {useEffect, useState, useCallback} from "react";
import {
    Box,
    VStack,
    Spinner,
    Text,
    useBreakpointValue,
    Center,
    Button,
} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "react-beautiful-dnd";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {POI, usePOI } from "../../poi/hooks/usePOI";
import {css} from "@emotion/react";
import AddButton from "./AddButton";
import POIItem from "./POIItem";
import {FaAngleDown} from "react-icons/fa";

const scrollbarStyle = css`
  &::-webkit-scrollbar {
    width: 7px;
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

const POIList: React.FC = () => {
    const isMobile = useBreakpointValue({base: true, md: false});
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {nickName} = useParams<{ nickName: string }>();
    const savedNickName = localStorage.getItem("nickName");
    const [pois, setPois] = useState<POI[]>([]);
    const [page, setPage] = useState(0);
    const ishost = nickName === savedNickName;
    const {loading, error, fetchTitles, isLastPage, reorderPOIs} = usePOI();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const calculateSize = () => {
        const width = window.innerWidth;
        if (width < 768) return 4;
        else return 9;
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
            loadTitles();
        }
    }, [nickName, size]);

    const loadTitles = async () => {
        try {
            let data: POI[];
            if (token) {
                data = await fetchTitles(nickName!, page, size, token);
            } else data = await fetchTitles(nickName!, page, size);

            setPois((prevPois) => [...prevPois, ...data]);
            setPage((prevPage) => prevPage + 1);
        } catch (err) {
            console.error("Failed to fetch titles", err);
        }
    };

    const handleCreatePOI = useCallback(() => {
        if (nickName) {
            navigate(`/${nickName}/poi/create`);
        }
    }, [nickName, navigate]);

    const handleGetPOI = useCallback(
        (poiId: number) => {
            if (nickName) {
                if (token) navigate(`/${nickName}/poi/${poiId}?token=${token}`);
                else navigate(`/${nickName}/poi/${poiId}`);
            }
        },
        [nickName, navigate]
    );

    const handleDragEnd = useCallback(
        async (result: DropResult) => {
            if (!result.destination) return;

            try {
                 const reorderdPoies = await reorderPOIs(Number(result.draggableId), result.destination.index);
                 setPois(reorderdPoies);
                 setPage(0);
            } catch (error) {
                console.error("Failed to update POI indexes:", error);
            }
        },
        [pois, reorderPOIs]
    );


    if (loading && page === 0) {
        return <Spinner/>;
    }

    if (error) {
        return <Text color="red.500">{error}</Text>;
    }

    return (
        <VStack
            spacing={ishost ? 1 : 3}
            align="stretch"
            bg="#F6F6F6"
            borderRadius="3xl"
            h="100%"
            w="100%"
            // minWidth={"200px"}
            // maxWidth={"330px"}
            overflow="hidden"
            p={4}
            color="#CDCDCD"
            border={isMobile ? "" : "1px solid"}
            gap={3}
        >
            {ishost && (
                <AddButton isMobile={isMobile as boolean} onClick={handleCreatePOI}/>
            )}
            {
                ishost ?
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId={"poi-list"}>
                            {(provided) => (
                                <Box h="100%" overflowY="auto" css={scrollbarStyle}
                                     ref={provided.innerRef}
                                     {...provided.droppableProps}
                                     w={"100%"}
                                >
                                    {pois.length === 0 ? (
                                        <Center h="80%">
                                            <Text color={"gray.500"}>{t("POI 목록이 비어 있습니다.")}</Text>
                                        </Center>
                                    ) : (
                                        <VStack
                                            h="100%"
                                            width="100%"
                                            gap={3}
                                        >
                                            {pois.map((item) => (
                                                <Draggable
                                                    key={item.id?.toString()}
                                                    draggableId={item.id?.toString() || ""}
                                                    index={item.index}>
                                                    {
                                                        (provided) => (
                                                            <Box
                                                                w={"100%"}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <POIItem
                                                                    // ref={provided.innerRef}
                                                                    key={item.id?.toString()}
                                                                    id={item.id as number}
                                                                    title={item.title}
                                                                    isMobile={isMobile as boolean}
                                                                    onClick={handleGetPOI}
                                                                />
                                                            </Box>
                                                        )
                                                    }
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </VStack>
                                    )}
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext> :
                    <>
                        {pois.length === 0 ? (
                            <Center h="80%">
                                <Text color={"gray.500"}>{t("POI 목록이 비어 있습니다.")}</Text>
                            </Center>
                        ) : (
                            <>
                                {pois.map((item) => (
                                        <POIItem
                                            // ref={provided.innerRef}
                                            key={item.id?.toString()}
                                            id={item.id as number}
                                            title={item.title}
                                            isMobile={isMobile as boolean}
                                            onClick={handleGetPOI}
                                        />
                                ))}
                            </>
                        )}
                    </>
            }
            {!isLastPage && (
                <Center>
                    <Button
                        onClick={loadTitles}
                        isLoading={loading}
                        size="md"
                        bg="#F6F6F6"
                    >
                        <FaAngleDown fontSize="24px"/>
                    </Button>
                </Center>
            )}
        </VStack>
    );
};

export default POIList;
