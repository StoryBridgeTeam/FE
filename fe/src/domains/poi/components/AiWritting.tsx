import React, {ChangeEvent, Dispatch, SetStateAction, useState} from "react";
import {
    Box,
    Button, CloseButton,
    Flex,
    HStack, Icon,
    IconButton, Image,
    Input,
    InputGroup, InputLeftAddon,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs, Text,
    Textarea,
    useBreakpointValue,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {AddIcon, ChevronLeftIcon, ChevronRightIcon, DeleteIcon, MinusIcon} from "@chakra-ui/icons";
import {UseAiWrittingReturn} from "../hooks/useAiWritting";
import {useImage, useImageResponse} from "../../../common/hooks/useImage";
import {use} from "i18next";
import ImageUploader from "../../../common/components/image/ImageUploader";

const AiWritting = ({useAiWritting, imageHook}:{useAiWritting:UseAiWrittingReturn, imageHook:useImageResponse}) => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    if(isMobile){
        return <Modal
            size={"xxl"}
            isOpen={useAiWritting.isOpen} onClose={useAiWritting.onClose}
                      closeOnOverlayClick={true}
                      motionPreset='slideInBottom'>
            <ModalOverlay />
            <ModalContent p={3} containerProps={{ alignItems: 'flex-end', padding:0}} margin={0}>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <AiWrittingBody aiWrittingHook={useAiWritting} imageHook={imageHook}/>
            </ModalContent>
        </Modal>
    }else{
        return <AiWrittingBody aiWrittingHook={useAiWritting} imageHook={imageHook}/>;
    }
};

const AiWrittingBody = ({aiWrittingHook, imageHook}:{aiWrittingHook:UseAiWrittingReturn, imageHook:useImageResponse}) => {
    return <Tabs variant={"enclosed"} w="100%" minW={{base:"100%", md:"300px"}} maxW={"400px"} h={"100%"}
              border={"0.5px solid #cdcdcd"} p={3} borderRadius={10} maxH={{base:"350px", md:"600px"}} minH={{base:"200px", md:"400px"}} overflowY={"auto"}>
            <TabList>
                <Tab isDisabled={aiWrittingHook.loading}>기본</Tab>
                <Tab
                    isDisabled={aiWrittingHook.loading}
                >문장</Tab>
                <Tab
                    isDisabled={aiWrittingHook.loading}
                >뉴스</Tab>
                <Tab
                    isDisabled={aiWrittingHook.loading}
                >이미지</Tab>
            </TabList>
            <TabPanels height={"100%"} maxH={{base:"250px", md:"500px"}}>
                <TabPanel height={"100%"}><BaseWritting aiWrittingHook={aiWrittingHook}/></TabPanel>
                <TabPanel height={"100%"}><SentWritting aiWrittingHook={aiWrittingHook}/></TabPanel>
                <TabPanel height={"100%"}><NewsWritting aiWrittingHook={aiWrittingHook}/></TabPanel>
                <TabPanel height={"100%"}><ImageWritting aiWrittingHook={aiWrittingHook} imageHook={imageHook}/></TabPanel>
            </TabPanels>
        </Tabs>
}

const BaseWritting = ({aiWrittingHook}:{aiWrittingHook:UseAiWrittingReturn}) => {
    const [content, setContent] = useState<string>("");

    const handleOnClick = async () => {
        if(content==null || content=="") return;

        aiWrittingHook.handleBaseWritting(content)
    }

    return <VStack gap={3} height={"100%"} justifyContent={"space-between"} position={"relative"} >
        {
            aiWrittingHook.loading &&
            <Spinner position={"absolute"} top={"50%"}/>
        }
        <Textarea value={content}
                  disabled={aiWrittingHook.loading}
                  onChange={e => setContent(e.target.value)} w={"100%"} h={"100%"} placeholder={"AI에게 도움 받을 글을 입력하세요!"} resize={"none"} />
        <Button w={"100%"} colorScheme={"purple"} isDisabled={aiWrittingHook.loading} onClick={handleOnClick}>AI 글쓰기</Button>
    </VStack>
}

const NewsWritting = ({aiWrittingHook}:{aiWrittingHook:UseAiWrittingReturn}) => {
    const [link, setLink] = useState<string>("");

    const handleClickWrittingBtn = async () => {
        if(link==null || link.length<=0) return;

        aiWrittingHook.handleNewsWritting(link);
    }

    return <VStack gap={3} height={"100%"} justifyContent={"space-between"}>
        {
            aiWrittingHook.loading &&
            <Spinner position={"absolute"} top={"50%"}/>
        }
        <InputGroup>
            <InputLeftAddon>URL:</InputLeftAddon>
            <Input type={"url"} value={link} onChange={e => setLink(e.target.value)} disabled={aiWrittingHook.loading} placeholder={"example.com"} />
        </InputGroup>
        <Button w={"100%"} isDisabled={aiWrittingHook.loading} colorScheme={"purple"} onClick={handleClickWrittingBtn}>AI 글쓰기</Button>
    </VStack>
}

const ImageWritting = ({aiWrittingHook, imageHook}:{aiWrittingHook:UseAiWrittingReturn, imageHook:useImageResponse}) => {
    const [viewIndex, setViewIndex] = useState(0);
    const [carouselTransition, setCarouselTransition] = useState(
        "transform 500ms ease-in-out"
    );

    const handleClickBtn = (num: number) => {
        if (viewIndex + num === -1 || viewIndex+num === imageHook.images.length) {
            return;
        }
        setViewIndex(viewIndex+num)
        setCarouselTransition("transform 500ms ease-in-out");
    };

    const handleClickWrittingBtn = () => {
        if(imageHook.images.length<=0) return;

        aiWrittingHook.handleImageWritting(imageHook.images[viewIndex].path);
    }

    return <VStack gap={3} height={"100%"} justifyContent={"space-between"} position={"relative"}>
        {
            (imageHook.loading || aiWrittingHook.loading) &&
            <Box>
                <Spinner position={"absolute"} top={"50%"}/>
            </Box>
        }
        {
            !imageHook.loading && imageHook.images.length>0 &&
            <Flex w="full" h="full" overflow="hidden" flexDirection="column">
                <Flex
                    h="80%"
                    transform={`translateX(-${100 * viewIndex}%)`}
                    transition={carouselTransition}
                >
                    {imageHook.images.map((image, i) => (
                        <Box w="full" flexShrink={0} flexGrow={0}>
                            <Image
                                _hover={{ cursor: "pointer" }}
                                objectFit="contain"
                                w="full"
                                h="full"
                                borderRadius={10}
                                key={i}
                                src={`http://image.storyb.kr/${image.path}`}
                            />
                        </Box>
                    ))}
                </Flex>
                <Flex justifyContent="center">
                    <Flex alignItems="center" gap={1}>
                        <IconButton
                            aria-label="left-btn"
                            bgColor="transparent"
                            onClick={() => handleClickBtn(-1)}
                            icon={<ChevronLeftIcon />}
                        />
                        {imageHook.images.map((_, i) => (
                            <CircleIcon color={i==viewIndex ? "gray.900" : "gray.300"} />
                        ))}
                        <IconButton
                            aria-label="right-btn"
                            bgColor="transparent"
                            onClick={() => handleClickBtn(1)}
                            icon={<ChevronRightIcon />}
                        />
                    </Flex>
                </Flex>
            </Flex>
        }
        {
            !imageHook.loading && imageHook.images.length==0 &&
            <VStack justifyContent={"center"} h={"100%"}>
                <Text border={"1px dashed gray"} p={5} borderRadius={10}>오른쪽 본문 글에서 이미지를 추가해주세요.</Text>
            </VStack>
        }
        <Button w={"100%"} colorScheme={"purple"} isDisabled={imageHook.loading || aiWrittingHook.loading} onClick={handleClickWrittingBtn}>AI 글쓰기</Button>
    </VStack>
}

const SentWritting = ({aiWrittingHook}:{aiWrittingHook:UseAiWrittingReturn}) => {
    const [sents, setSents] = useState<string[]>([""]);

    const handleClickAddBtn = () => {
        setSents(prevState => [...prevState, ""])
    }

    const handleClickWrittingBtn = async () => {
        aiWrittingHook.handleSentenceWritting(sents.filter(s => s!=null && s.length>0));
    }

    return <VStack gap={3} height={"100%"} justifyContent={"space-between"} position={"relative"}>
        {
            aiWrittingHook.loading &&
            <Spinner position={"absolute"} top={"50%"}/>
        }
        <VStack w={"100%"}>
            {
                sents.map((s, idx) => <SentInputRow disabled={aiWrittingHook.loading} idx={idx} sents={sents} setSentArr={setSents}/>)
            }
            <IconButton aria-label={"add"} variant={"outline"} onClick={handleClickAddBtn} isDisabled={aiWrittingHook.loading}>
                <AddIcon />
            </IconButton>
        </VStack>
        <Box w={"100%"} h={"100px"} py={5}>
            <Button w={"100%"} colorScheme={"purple"} onClick={handleClickWrittingBtn} isDisabled={aiWrittingHook.loading}>AI 글쓰기</Button>
        </Box>
    </VStack>
}

const SentInputRow = ({disabled, sents, idx, setSentArr}:{disabled:boolean, sents:string[], idx:number, setSentArr:Dispatch<SetStateAction<string[]>>}) => {

    const handleClickRemoveBtn = () => {
        setSentArr(prevState => prevState.filter((p, index)=> index!=idx))
    }

    const handleOnChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const originalArr = [...sents]
        originalArr[idx] = e.target.value;
        setSentArr(originalArr);
    }

    return <HStack w={"100%"}>
        <Input disabled={disabled} value={sents[idx]} onChange={handleOnChange}/>
        <IconButton aria-label={"delete"} variant={"outline"} onClick={handleClickRemoveBtn} isDisabled={disabled}>
            <MinusIcon />
        </IconButton>
    </HStack>
}

const CircleIcon = (props: any) => {
    return (
        <Icon viewBox="0 0 200 200" boxSize={3} {...props}>
            <path
                fill="currentColor"
                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
            />
        </Icon>
    );
};

export default AiWritting;
