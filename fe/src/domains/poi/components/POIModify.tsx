import React, { useState, useEffect, useCallback } from "react";
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
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { usePOI, POI, GETPOI, ImageData } from "../../poi/hooks/usePOI";
import { Plus, X } from "tabler-icons-react";
import { deleteImage, uploadImage } from "../../../common/api/imageAPI";
import { carouselSettings } from "../../amt/utils/carouselSetting";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const POIModify: React.FC<{ poiId: string }> = ({ poiId }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { nickName } = useParams<{ nickName: string }>();
  const localNickname = localStorage.getItem("nickName");
  const isHost = nickName === localNickname;
  const [poi, setPoi] = useState<GETPOI>();
  const { fetchPOI, loading, error, modifyPOI } = usePOI();
  const { showToast } = useToastMessage();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const MAX_TITLE_LENGTH = 50;
  const [images, setImages] = useState<ImageData[]>([]);
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  useEffect(() => {
    if (isHost && nickName && poiId) {
      fetchPOI(nickName, Number(poiId)).then((data) => setPoi(data));
      fetchPOI(nickName, Number(poiId)).then((data) => {
        setPoi(data);
        setTitle(data.title);
        setContent(data.content);
        setImages(data.images);
      });
    }
  }, [nickName, poiId]);

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
        images: images.map((image) => image.id),
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

  const handleDeleteImage = async (imageId: number) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image.id !== imageId)
    );
    await deleteImage(imageId);
  };

  const handleImageClick = (imgSrc: ImageData) => {
    setSelectedImage(imgSrc);
    onModalOpen();
  };

  const handleUpload = async () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadType = "POI";

          const uploadedImage = await uploadImage(uploadType, formData);
          setImages((prevImages) => [...prevImages, uploadedImage]);
        }
      };

      input.click();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  if (!isHost) {
    if (token) return <Navigate to={`/${nickName}?token=${token}`} replace />;
    else return <Navigate to={`/${nickName}`} replace />;
  }

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <VStack spacing={4} align="stretch" p={6}>
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
      <Flex w="full" justifyContent="flex-left" alignItems="center" mb={-10}>
        <Button onClick={handleUpload} size="md" colorScheme="blue">
          <Plus size={24} />
        </Button>
      </Flex>
      {images.length !== 0 && (
        <Box w={"80%"} margin={"auto"} minH={"30vh"} mb={5}>
          <Slider {...carouselSettings}>
            {images.map((imgSrc, index) => (
              <Box key={index} position="relative">
                <Flex h="30vh" justifyContent="center" alignItems="center">
                  <IconButton
                    aria-label="Delete image"
                    icon={<X size={18} />}
                    position="absolute"
                    colorScheme="red"
                    top="2px"
                    right="2px"
                    size="xs"
                    zIndex={1}
                    onClick={() => handleDeleteImage(imgSrc.id)}
                  />
                  <Image
                    src={`http://image.storyb.kr/${imgSrc.path}`}
                    alt={imgSrc.name}
                    display="block"
                    maxH="30vh"
                    maxW="100%"
                    objectFit="contain"
                    borderRadius="10px"
                    onClick={() => handleImageClick(imgSrc)}
                  />
                </Flex>
              </Box>
            ))}
          </Slider>
        </Box>
      )}
      <Textarea
        minHeight="550px"
        placeholder="본문 내용을 작성해주세요"
        variant="unstyled"
        px={6}
        value={content}
        onChange={handleContentChange}
        isDisabled={loading}
      />
      <Box textAlign="center">
        <Button
          isDisabled={isButtonDisabled}
          colorScheme="blue"
          onClick={handleModifyPOI}
          leftIcon={loading ? <Spinner size="sm" /> : undefined}
        >
          {loading ? "수정 중..." : "POI 수정"}
        </Button>
      </Box>
      {selectedImage && (
        <Modal isOpen={isModalOpen} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
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
  );
};

export default POIModify;
