import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack,
    Icon,
    Input,
    useBreakpointValue,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import InviteModal from "../../../common/components/InviteModal";
import React, {useState} from "react";
import {UseCardHookReturn} from "../hooks/useCardHook";
import {Edit, GripVertical, Share, Trash} from "tabler-icons-react";
import CardInfoItem from "./CardInfoItem";
import {EntryState} from "../types/cardTypes";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {AddIcon} from "@chakra-ui/icons";

export const HorizontalBarDesign = ({editMode, setEditMode, handleClick, cardHook, detail = false, isHost = false}: {
    editMode ?: boolean,
    setEditMode ?: any,
    handleClick : () => void,
    cardHook: UseCardHookReturn,
    detail?: boolean,
    isHost?: boolean
}) => {
    const isMobile = useBreakpointValue({base: true, md: false});

    const {currentCardInfo: cardInfo} = cardHook;

    const {
        isOpen: isInviteModalOpen,
        onOpen: onInviteModalOpen,
        onClose: onInviteModalClose,
    } = useDisclosure();

    return <VStack
        w={"100%"}
        onClick={handleClick}
        align="stretch" spacing={2} color="black" h={"100%"} maxH={"350px"} position={"relative"} p={7}
        border={"1px solid gray"} borderRadius={10}>
        {cardInfo && (
            <Flex alignItems="center" justifyContent="space-between">
                <Heading
                    fontSize={isMobile ? "md" : "x-large"}
                    textAlign="left"
                >
                    {cardInfo.name}
                </Heading>
            </Flex>
        )}
        <Box
            borderBottom={"2px solid gray"}
            cursor="pointer"
            h={"100%"}
            minH={"200px"}
            boxSizing={"border-box"}
            pt={"40px"}
            px={1}
            overflowY="auto"
        >
            {
                editMode ?
                    <EditView useCardHook={cardHook} setEditMode={setEditMode} onInviteModalOpen={onInviteModalOpen}
                              isHost={isHost}/> :
                    <ReadView setEditMode={setEditMode} onInviteModalOpen={onInviteModalOpen} useCardHook={cardHook}
                              isHost={isHost} detail={detail}/>
            }
        </Box>
        {isInviteModalOpen && (
            <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose}/>
        )}
    </VStack>
}

export const VerticalBarDesign = ({editMode, setEditMode, handleClick, cardHook, detail = false, isHost = false}: {
    editMode ?: boolean,
    setEditMode ?: any,
    handleClick : () => void,
    cardHook: UseCardHookReturn,
    detail?: boolean,
    isHost?: boolean
}) => {
    const isMobile = useBreakpointValue({base: true, md: false});
    const {currentCardInfo: cardInfo} = cardHook;

    const {
        isOpen: isInviteModalOpen,
        onOpen: onInviteModalOpen,
        onClose: onInviteModalClose,
    } = useDisclosure();

    return <VStack
        w={"100%"}
        onClick={handleClick}
        align="stretch" spacing={2} color="black" h={"100%"} maxH={"350px"} position={"relative"} p={7}
        border={"1px solid gray"} borderRadius={10}>
        <Box borderLeft={"3px solid gray"} pl={5} pt={2}>
            {cardInfo && (
                <Flex alignItems="center" justifyContent="space-between">
                    <Heading
                        fontSize={isMobile ? "md" : "x-large"}
                        textAlign="left"
                    >
                        {cardInfo.name}
                    </Heading>
                </Flex>
            )}
            <Box
                cursor="pointer"
                h={"100%"}
                minH={"200px"}
                boxSizing={"border-box"}
                pt={"40px"}
                px={1}
                overflowY="auto"
            >
                {
                    editMode ?
                        <EditView useCardHook={cardHook} setEditMode={setEditMode} onInviteModalOpen={onInviteModalOpen}
                                  isHost={isHost}/> :
                        <ReadView setEditMode={setEditMode} onInviteModalOpen={onInviteModalOpen} useCardHook={cardHook}
                                  isHost={isHost} detail={detail}/>
                }
            </Box>
            {isInviteModalOpen && (
                <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose}/>
            )}
        </Box>
    </VStack>
}

const ReadView = ({onInviteModalOpen, setEditMode, useCardHook, isHost, detail}: {
    onInviteModalOpen: any,
    setEditMode: any,
    useCardHook: UseCardHookReturn,
    isHost: boolean,
    detail : boolean
}) => {
    const {currentCardInfo: cardInfo} = useCardHook;

    return <>
        {isHost &&  (
            <HStack position={"absolute"} right={2} top={2} gap={1}>
                {
                    detail &&
                    <Button size="sm" onClick={() => setEditMode(true)} bg="white">
                        <Edit size={20} color="black"/>
                    </Button>
                }
                <Button size="sm" bg="white" onClick={e => {
                    e.stopPropagation();
                    onInviteModalOpen();
                }}>
                    <Share size={20} color="black"/>
                </Button>
            </HStack>
        )}
        {cardInfo ? (
            <VStack gap={1} w={"100%"} alignItems={"start"}>
                {cardInfo.entries.sort((a,b) => a.index-b.index).map((entry) => (
                    <CardInfoItem {...entry} />
                ))}
            </VStack>
        ) : (
            <Center w="100%" fontSize="2xl" color="gray.700">
                {isHost
                    ? "명함카드를 만들어보세요!"
                    : "명함카드를 만들지 않은 사용자입니다"}
            </Center>
        )}
    </>
}

const EditView = ({onInviteModalOpen, setEditMode, useCardHook, isHost}: {
    onInviteModalOpen: any,
    setEditMode: any,
    useCardHook: UseCardHookReturn,
    isHost: boolean
}) => {
    const {currentCardInfo} = useCardHook;
    const [currentEntries, setCurrentEntries] = useState<EntryState[]>(
        currentCardInfo?.entries ? currentCardInfo.entries : []
    );

    const reorderEntries = (startIndex: number, endIndex: number) => {
        const result = Array.from(currentEntries);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        const reindexedEntries = result.map((entry, index) => ({
            ...entry,
            index,
        }));

        return reindexedEntries;
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderd = reorderEntries(result.source.index, result.destination.index);

        setCurrentEntries(reorderd)
    };

    const handleAddBtn = () => {
        const newEntries = [...currentEntries, {
            id: null,
            title: "",
            content: "",
            index: currentEntries.length,
            isVisibleBriefCard: false
        }];

        setCurrentEntries(newEntries);
    }

    const handleDeleteBtn = (index: number) => {
        currentEntries.splice(index, 1);
        const newEntryState = currentEntries.map((e, index) => ({...e, index: index}));

        setCurrentEntries(newEntryState);
    }

    const handleChangeText = (index: number, key: string, value: string) => {
        const newEntries = currentEntries;

        newEntries[index] = {
            ...currentEntries[index],
            [key]: value
        }

        setCurrentEntries(newEntries);
    }

    const handleToggleVisibility = (index: number) => {
        const newEntries = currentEntries;

        newEntries[index] = {
            ...currentEntries[index],
            isVisibleBriefCard: !currentEntries[index].isVisibleBriefCard
        }

        setCurrentEntries(newEntries);
    }

    const handleSaveBtn = () => {
        useCardHook.handleEntryChange(currentEntries);
        setEditMode(false);
    }

    return <Box>
        {isHost && (
            <HStack position={"absolute"} right={2} top={2} gap={1}>
                <Button size="sm" onClick={handleSaveBtn} bg="white">
                    <Edit size={20} color="black"/>
                </Button>
                <Button size="sm" bg="white" onClick={e => {
                    e.stopPropagation();
                    onInviteModalOpen();
                }}>
                    <Share size={20} color="black"/>
                </Button>
            </HStack>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="entries">
                {(provided) => (
                    <Box
                        w={"100%"}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {currentEntries.sort((a,b) => a.index-b.index).map((entry, index) => (
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
                                        mb={2}
                                        p={1}
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        justifyContent={"space-between"}
                                        alignItems="center"
                                    >
                                        <GripVertical/>
                                        <Flex alignItems="center" w={"100%"} justifyContent={"start"} gap={2}>
                                            <Input
                                                // value={currentEntries[index].title}
                                                defaultValue={entry.title}
                                                onChange={e => handleChangeText(index, "title", e.target.value)}
                                                fontWeight="bold"
                                                size="sm"
                                                width="35%"
                                                mr={2}
                                                placeholder="항목"
                                            />
                                            <Input
                                                // value={currentEntries[index].content}
                                                defaultValue={entry.content}
                                                onChange={e => handleChangeText(index, "content", e.target.value)}
                                                size="sm"
                                                width="65%"
                                                placeholder="설명"
                                            />
                                            <Icon
                                                onClick={() => handleToggleVisibility(index)}
                                                as={entry.isVisibleBriefCard ? FaEye : FaEyeSlash}
                                                color={entry.isVisibleBriefCard ? "black" : "gray"}
                                                ml={2}
                                            />
                                            <Button size="sm" onClick={() => handleDeleteBtn(index)} bg="white">
                                                <Trash color="red"/>
                                            </Button>
                                        </Flex>
                                    </Flex>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </Box>
                )}
            </Droppable>
        </DragDropContext>
        <HStack justifyContent={"center"} my={3}>
            <Button variant={"outline"} onClick={() => handleAddBtn()}>
                <AddIcon/>
            </Button>
        </HStack>
    </Box>
}
