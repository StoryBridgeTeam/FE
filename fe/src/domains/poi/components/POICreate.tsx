import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  Divider,
  Text,
  Spinner,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  IconButton, HStack, useBreakpointValue, Center,
} from "@chakra-ui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { usePOI } from "../../poi/hooks/usePOI";
import { File, X } from "tabler-icons-react"; // X 아이콘 추가
import { deleteImage, uploadImage } from "../../../common/api/imageAPI";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { carouselSettings } from "../../amt/utils/carouselSetting";
import AiWritting from "./AiWritting";
import {useAiWritting} from "../hooks/useAiWritting";
import {AddIcon, EditIcon} from "@chakra-ui/icons";
import ImageUploader from "../../../common/components/image/ImageUploader";
import {useImage} from "../../../common/hooks/useImage";
import { FaRegImage } from "react-icons/fa6";
import { FaFileVideo } from "react-icons/fa6";
import useVideo from "../../../common/hooks/useVideo";
import VideoPlayerEditor from "../../../common/components/video/VideoPlayerEditor";



interface ImageData {
  id: number;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

const POICreate: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const MAX_TITLE_LENGTH = 50;
  const { addPOI, loading, error } = usePOI();
  const navigate = useNavigate();
  const { showToast } = useToastMessage();
  const localNickname = localStorage.getItem("nickName");
  const { nickName } = useParams<{ nickName: string }>();
  const isHost = localNickname === nickName;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, MAX_TITLE_LENGTH);
    setTitle(newTitle);
  };

  const useAiWrittingHook = useAiWritting();
  const imageHook = useImage();
  const videoHook = useVideo();

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    if(useAiWrittingHook.result!=null && useAiWrittingHook.result!=""){
      setContent(prevState => prevState+"\n\n"+useAiWrittingHook.result)
    }
  }, [useAiWrittingHook.result]);

  const handleImageClick = (imgSrc: ImageData) => {
    setSelectedImage(imgSrc);
    onModalOpen();
  };


  const isButtonDisabled = title.trim() === "" || content.trim() === "";

  const handleCreatePOI = useCallback(async () => {
    const videoIds = videoHook.video!=null ? [videoHook.video.id] : []
    try {
      await addPOI(
        title,
        content,
        imageHook.images.map((image) => image.id),
          videoIds
      );
      navigate(`/${localNickname}`);
      showToast("POI 생성 성공", "POI가 성공적으로 생성되었습니다.", "success");
    } catch (error) {
      console.error("Failed to create POI:", error);
      showToast("POI 생성 실패", "POI 생성에 실패했습니다.", "error");
    }
  }, [localNickname, title, content, addPOI, navigate, showToast]);


  if (!isHost) {
    if (token) return <Navigate to={`/${nickName}?token=${token}`} replace />;
    else return <Navigate to={`/${nickName}`} replace />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Flex w={"100%"} gap={10} justifyContent={isMobile ? "start" : "center"} alignItems={"center"} h={"100%"} direction={isMobile?"column":"row"}>
      <AiWritting useAiWritting={useAiWrittingHook} imageHook={imageHook}/>
      {
        isMobile &&
          <IconButton aria-label={"modal"} position={"fixed"} bottom={4} right={4} size={"lg"}
                      isRound={true} colorScheme={"purple"}
                      onClick={useAiWrittingHook.onOpen}
                      icon={<EditIcon />}
          />
      }
      <VStack spacing={4} align="stretch" gap={1} p={6} h={"100%"} minWidth={{base:"100%", md:"700px"}} maxW={{base:"100%", md:"900px"}}>
        <Flex justifyContent={"right"}>
          <IconButton aria-label={"add"}
                      isDisabled={isButtonDisabled}
                      onClick={handleCreatePOI}
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
          _placeholder={{ color: "#828282" }}
          textAlign="center"
          value={title}
          onChange={handleTitleChange}
          maxLength={MAX_TITLE_LENGTH}
          isDisabled={loading}
        />
        <Text fontSize="sm" color="gray.500" textAlign="right" mt={-5}>
          {title.length}/{MAX_TITLE_LENGTH}
        </Text>
        <Divider borderColor="#828282" borderWidth="1px" />
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
          minHeight="500px"
          resize={"none"}
          placeholder="본문 내용을 작성해주세요"
          variant="unstyled"
          px={6}
          value={content}
          onChange={handleContentChange}
          isDisabled={loading || imageHook.loading || videoHook.loading}
        />
      </VStack>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {selectedImage && (
            <Image
              src={`http://image.storyb.kr/${selectedImage.path}`}
              alt={selectedImage.name}
              objectFit="contain"
            />
          )}
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default POICreate;
