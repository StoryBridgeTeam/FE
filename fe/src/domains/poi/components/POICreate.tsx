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
  IconButton,
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
  const [images, setImages] = useState<ImageData[]>([]);
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

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleImageClick = (imgSrc: ImageData) => {
    setSelectedImage(imgSrc);
    onModalOpen();
  };

  const handleDeleteImage = async (imageId: number) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image.id !== imageId)
    );
    await deleteImage(imageId);
  };

  const isButtonDisabled = title.trim() === "" || content.trim() === "";

  const handleCreatePOI = useCallback(async () => {
    try {
      await addPOI(
        title,
        content,
        images.map((image) => image.id)
      );
      navigate(`/${localNickname}`);
      showToast("POI 생성 성공", "POI가 성공적으로 생성되었습니다.", "success");
    } catch (error) {
      console.error("Failed to create POI:", error);
      showToast("POI 생성 실패", "POI 생성에 실패했습니다.", "error");
    }
  }, [localNickname, title, content, addPOI, navigate, showToast]);

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

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <>
      <VStack spacing={4} align="stretch" p={6}>
        <Flex w="full" justifyContent="flex-end" alignItems="center" mb={5}>
          <Button onClick={handleUpload} mr={2}>
            <File size={24} color="black" />
          </Button>
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
        {images.length !== 0 && (
          <Box w={"80%"} margin={"auto"} minH={"30vh"}>
            <Slider {...carouselSettings}>
              {images.map((imgSrc, index) => (
                <Box key={index} position="relative">
                  <IconButton
                    aria-label="Delete image"
                    icon={<X size={18} />}
                    position="absolute"
                    colorScheme="red"
                    top="5px"
                    right="5px"
                    size="xs"
                    zIndex={1}
                    onClick={() => handleDeleteImage(imgSrc.id)}
                  />

                  <Flex h="30vh" justifyContent="center" alignItems="center">
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
            onClick={handleCreatePOI}
            leftIcon={loading ? <Spinner size="sm" /> : undefined}
          >
            {loading ? "생성 중..." : "POI 생성"}
          </Button>
        </Box>
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
    </>
  );
};

export default POICreate;
