import React, {useState, useEffect, useCallback, useRef, useLayoutEffect} from "react";
import {
    Box,
    Input,
    Textarea,
    Button,
    VStack,
    Divider,
    Text,
    Spinner,
    useBreakpointValue,
    Image,
    IconButton,
    Flex,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton, HStack, Center,
} from "@chakra-ui/react";
import {
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import {useToastMessage} from "../../../common/hooks/useToastMessage";
import {usePOI, POI, GETPOI} from "../../poi/hooks/usePOI";
import {Plus, X} from "tabler-icons-react";
import {deleteImage, uploadImage} from "../../../common/api/imageAPI";
import {carouselSettings} from "../../amt/utils/carouselSetting";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {ImageRes, useImage} from "../../../common/hooks/useImage";
import {uploadVideo, VideoType} from "../../../common/api/videoAPI";

import videojs from "video.js";
import "video.js/dist/video-js.css";
import AiWritting from "./AiWritting";
import {AddIcon, EditIcon} from "@chakra-ui/icons";
import {useAiWritting} from "../hooks/useAiWritting";
import ImageUploader from "../../../common/components/image/ImageUploader";
import VideoPlayerEditor from "../../../common/components/video/VideoPlayerEditor";
import useVideo from "../../../common/hooks/useVideo";
import {FaFileVideo, FaRegImage} from "react-icons/fa6";

const POIModify: React.FC<{ poiId: string }> = ({poiId}) => {
    const isMobile = useBreakpointValue({base: true, md: false});
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const {nickName} = useParams<{ nickName: string }>();
    const localNickname = localStorage.getItem("nickName");
    const isHost = nickName === localNickname;
    const [poi, setPoi] = useState<GETPOI>();
    const {loading, error, modifyPOI} = usePOI();
    const {showToast} = useToastMessage();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const MAX_TITLE_LENGTH = 50;
    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onClose: onModalClose,
    } = useDisclosure();
    const playerRef = useRef<any>(null);

    const [selectedImage, setSelectedImage] = useState<ImageRes | null>(null);
    const initPoi = location.state.poi;

    useEffect(() => {
        if(initPoi){
            setPoi(initPoi);
            setTitle(initPoi.title);
            setContent(initPoi.content);
        }
    }, [initPoi]);

    const useAiWrittingHook = useAiWritting();
    const imageHook = useImage(initPoi.images);
    const videoHook = useVideo(initPoi.videos.length>0 ? initPoi.videos[0] : null);

    useEffect(() => {
        if(useAiWrittingHook.result!=null && useAiWrittingHook.result!=""){
            setContent(prevState => prevState+"\n\n"+useAiWrittingHook.result)
        }
    }, [useAiWrittingHook.result]);



    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value.slice(0, MAX_TITLE_LENGTH);
        setTitle(newTitle);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const isButtonDisabled =
        title.trim() === "" || content.trim() === "" || loading;

    const handleModifyPOI = useCallback(async () => {
        try {
            const poiData: POI = {
                id: Number(poiId),
                title,
                content,
                images: imageHook.images.map((image) => image.id),
                videos: videoHook.video ? [videoHook.video.id] : [],
                index: poi?.index as number,
            };
            await modifyPOI(Number(poiId), poiData);
            navigate(`/${nickName}/poi/${poiId}`);
            showToast("POI 수정 성공", "POI가 성공적으로 수정되었습니다.", "success");
        } catch (error) {
            console.error("Failed to modify POI:", error);
            showToast("POI 수정 실패", "POI 수정에 실패했습니다.", "error");
        }
    }, [title, content, poiId, modifyPOI, navigate, nickName, showToast]);

    if (!isHost) {
        if (token) return <Navigate to={`/${nickName}?token=${token}`} replace/>;
        else return <Navigate to={`/${nickName}`} replace/>;
    }

    if (loading) {
        return <Spinner/>;
    }

    if (error) {
        return <Text color="red.500">{error}</Text>;
    }

    return (
        <Flex w={"100%"} gap={10} justifyContent={"center"} alignItems={"center"} h={"100%"} direction={isMobile ? "column" : "row"}>
            <AiWritting useAiWritting={useAiWrittingHook} imageHook={imageHook}/>
            {
                isMobile &&
                <IconButton aria-label={"modal"} position={"fixed"} bottom={4} right={4} size={"lg"}
                            isRound={true} colorScheme={"purple"}
                            onClick={useAiWrittingHook.onOpen}
                            icon={<EditIcon />}
                />
            }
            <VStack spacing={4}h={"100%"} align="stretch" p={6} gap={1} minWidth={{base:"100%", md:"700px"}} maxW={{base:"100%", md:"900px"}}>
                <Flex justifyContent={"right"}>
                    <IconButton aria-label={"add"}
                                isDisabled={isButtonDisabled}
                                onClick={handleModifyPOI}
                    >
                        <EditIcon />
                    </IconButton>
                </Flex>
                <Input
                    placeholder="제목"
                    size="lg"
                    variant="unstyled"
                    fontSize="2xl"
                    fontWeight="bold"
                    _placeholder={{color: "#828282"}}
                    textAlign="center"
                    value={title}
                    onChange={handleTitleChange}
                    maxLength={MAX_TITLE_LENGTH}
                    isDisabled={loading}
                />
                <Text fontSize="sm" color="gray.500" textAlign="right" mt={-5}>
                    {title.length}/{MAX_TITLE_LENGTH}
                </Text>
                <Divider borderColor="#828282" borderWidth="1px"/>
                <Flex borderBottom={"0.5px solid gray"} w={"100%"} h={"35px"}
                      justifyContent={"end"} alignItems={"center"}
                >
                    <IconButton variant={"outlined"} isDisabled={videoHook.video!=null} size={"sm"} aria-label={"image-add"} onClick={() => videoHook.handleUpload("POI")}>
                        <FaFileVideo />
                    </IconButton>
                    <IconButton variant={"outlined"} size={"sm"} aria-label={"image-add"} onClick={() => imageHook.handleUploadImage("POI")}>
                        <FaRegImage />
                    </IconButton>
                </Flex>
                <VStack w={"100%"} justifyContent={"start"} position={"relative"} minH={"30px"}>
                    {
                        (imageHook.loading || videoHook.loading) && <Center w={"100%"} h={"100%"} position={"absolute"} bgColor={"rgba(219,219,219,0.5)"} zIndex={99} >
                            <Spinner  zIndex={999}/>
                        </Center>
                    }
                    {
                            imageHook.images.length>0 && <ImageUploader imageHook={imageHook} imageType={"POI"} isUploadable={false}/>
                    }
                    <VideoPlayerEditor videoHook={videoHook} />
                </VStack>
                <Textarea
                    minHeight="300px"
                    placeholder="본문 내용을 작성해주세요"
                    variant="unstyled"
                    px={6}
                    value={content}
                    onChange={handleContentChange}
                    isDisabled={loading}
                />
                {selectedImage && (
                    <Modal isOpen={isModalOpen} onClose={onModalClose}>
                        <ModalOverlay/>
                        <ModalContent>
                            <ModalCloseButton/>
                            <Image
                                src={`http://image.storyb.kr/${selectedImage.path}`}
                                alt={selectedImage.name}
                                maxH="80vh"
                                objectFit="contain"
                            />
                        </ModalContent>
                    </Modal>
                )}
            </VStack>
        </Flex>
    );
};

export default POIModify;
