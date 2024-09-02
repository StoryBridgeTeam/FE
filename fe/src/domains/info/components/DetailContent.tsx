import { useEffect, useState, FC } from "react";
import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  Button,
  Input,
  Textarea,
  Container,
  Image,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Edit, Check, File, X, Link } from "tabler-icons-react"; // X 아이콘 추가
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import { useTextSelection } from "../hook/useTextSelection";
import CommentList from "./CommentList";
import { useCommentStore } from "../Store/CommentStore";
import { renderContentWithIcons } from "./renderContentWithIcons";
import { useProfileStore } from "../Store/useProfileStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCoverLetters, putCoverLetters } from "../api/InfoAPI";
import ProfileSidebar from "./ProfileSideBar";
import { deleteImage, uploadImage } from "../../../common/api/imageAPI";
import InviteModal from "../../../common/components/InviteModal";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { carouselSettings } from "../../amt/utils/carouselSetting";
import CommentPresenter from "../../../common/components/comment/CommentPresenter";
import useComment from "../../../common/hooks/useComment";
import {deleteCommentServer, getComments, postComment, tagComment, updateComment} from "../api/CommentAPI";
import CommentInput from "../../../common/components/comment/CommentInput";

interface ImageData {
  id: number;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

interface CoverLetter {
  id: string;
  title: string;
  content: string;
  images?: ImageData[];
}

interface CoverLettersResponse {
  entries: {
    content: CoverLetter[] | null;
  };
}

const DetailContent: FC = () => {
  const { handleMouseUp } = useTextSelection();
  const { comments } = useCommentStore();
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedContent, setEditedContent] = useState<string>("");
  const [images, setImages] = useState<ImageData[]>([]);
  const { isEdit, setEdit } = useProfileStore();
  const { id: idParam, nickName: nickNameParam } = useParams<{
    nickName: string;
    id: string;
  }>();

  const name = localStorage.getItem("nickName") || "";
  const nickName = nickNameParam || "";
  const id :number = idParam ? parseInt(idParam, 10) : NaN;
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const isHost = nickName === name;
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const fetchCoverData = async () => {
    try {
      let entries;

      if (token) {
        const response: CoverLettersResponse = await getCoverLetters(
          nickName!,
          token
        );
        entries = response.entries;
      } else {
        const response: CoverLettersResponse = await getCoverLetters(nickName!);
        entries = response.entries;
      }

      if (entries.content === null) {
        navigate(`/${nickName}/info`);
      } else {
        const data = entries.content.find(
          (item) => parseInt(item.id, 10) === id
        );
        if (data) {
          setEditedTitle(data.title);
          setEditedContent(data.content);
          setImages(data.images || []);
        } else {
          console.error("Cover letter not found.");
        }
      }
    } catch (error) {
      console.error("Cover error:", error);
    }
  };

  useEffect(() => {
    fetchCoverData();
  }, [nickName, id]);

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

          const uploadType = "COVER";

          const uploadedImage = await uploadImage(uploadType, formData);
          setImages((prevImages) => [...prevImages, uploadedImage]);
        }
      };

      input.click();
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image.id !== imageId)
    );
    await deleteImage(imageId);
  };

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSaveClick = async () => {
    await putCoverLetters(
      nickName!,
      {
        id,
        title: editedTitle,
        content: editedContent,
      },
      images.map((image) => image.id)
    );

    setEdit(false);
    fetchCoverData();
  };

  const editModalDisclosure = useDisclosure();
  const connectModalDisclosure = useDisclosure();

  const commentHook = useComment(
      {
        targetId:id, fetchCommentAPI:getComments, editCommentAPI:updateComment, deleteCommentAPI:deleteCommentServer, tagCommentAPI:tagComment, createCommentAPI:postComment
      })


  const scrollToHighlightedText = (startIndex?: number, endIndex?: number) => {
    if (startIndex === undefined || endIndex === undefined) return;

    const highlightElements = document.querySelectorAll(`[id^='highlight-']`);
    highlightElements.forEach((element) => {
      const id = element.id.replace("highlight-", "");
      const comment = comments.find((c) => c.id.toString() === id);
      if (
        comment?.tagInfo?.startIndex === startIndex &&
        comment?.tagInfo?.lastIndex === endIndex
      ) {
        (element as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  const scrollToHighlightedComment = (
    startIndex?: number,
    endIndex?: number
  ) => {
    if (startIndex === undefined || endIndex === undefined) return;

    const comment = comments.find(
      (c) =>
        c.tagInfo?.startIndex === startIndex &&
        c.tagInfo?.lastIndex === endIndex
    );
    if (comment) {
      const elementId = `comment-${comment.id}`;
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        console.warn(`Element with id '${elementId}' not found.`);
      }
    } else {
      console.warn("Comment not found with specified indexes.");
    }
  };

  const processedComments = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    startIndex: comment.tagInfo?.startIndex || 0,
    endIndex: comment.tagInfo?.lastIndex || 0,
  }));

  const handleImageClick = (imgSrc: ImageData) => {
    setSelectedImage(imgSrc);
    onModalOpen();
  };


  return (
    <>
      {/*{!isMobile && <ProfileSidebar />}*/}
      <Container maxW="4xl">
        <Box
          minH={isMobile ? "calc(100vh - 80px)" : "calc(100vh - 85px)"}
          mt={6}
          w="full"
          cursor="pointer"
          position="relative"
          onMouseUp={handleMouseUp}
          dir="col"
        >
          <Flex
            w="full"
            justifyContent="space-between"
            alignItems="center"
            mb={5}
          >
            <Button
              onClick={() => {
                const url = `/${nickName}/info`;
                const searchParams = new URLSearchParams();

                if (token) {
                  searchParams.append("token", token);
                }

                navigate(`${url}?${searchParams.toString()}`, {
                  replace: true,
                });
              }}
            >
              {t("info.list")}
            </Button>
            {isEdit ? (
              <Box>
                <Button onClick={handleUpload} mr={2}>
                  <File size={24} color="black" />
                </Button>
                <Button onClick={handleSaveClick}>
                  <Check size={24} color="black" />
                </Button>
              </Box>
            ) : (
              isHost && (
                <Box>
                  <Button onClick={handleEditClick} mr={2}>
                    <Edit size={24} color="black" />
                  </Button>
                  <Button onClick={onOpen}>
                    <Link />
                    초대링크
                  </Button>
                </Box>
              )
            )}
          </Flex>
          <Flex
            h={isMobile ? "calc(100vh - 155px)" : "calc(100vh - 165px)"}
            overflowY="auto"
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            direction="column"
          >
            <Flex alignItems="center" dir="row">
              {isEdit ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => {
                    if (e.target.value.length <= 20) {
                      setEditedTitle(e.target.value);
                    }
                  }}
                  fontSize="lg"
                  fontWeight="bold"
                />
              ) : (
                <Text fontWeight="bold" fontSize="lg">
                  {editedTitle}
                </Text>
              )}
              <Box flex="1" borderBottom="2px" ml={2} />
            </Flex>

            <Box
              bg="#EEEEEE"
              mt={4}
              p={5}
              borderTopRadius="30px"
              userSelect="text"
              justifyContent={"center"}
            >
              {images.length > 0 && (
                <Box w={"70%"} margin={"auto"} mb={5}>
                  <Slider {...carouselSettings}>
                    {images.map((imgSrc, index) => (
                      <Box key={index} position="relative">
                        {isEdit && (
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
                        )}
                        <Flex
                          h="30vh"
                          justifyContent="center"
                          alignItems="center"
                        >
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
              {isEdit ? (
                <Textarea
                  minH="30vh"
                  maxH="52vh"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  size="lg"
                  mt={4}
                  borderRadius="10px"
                  p={4}
                />
              ) : (
                <Text>
                  {renderContentWithIcons(
                    editedContent,
                    processedComments,
                    scrollToHighlightedComment
                  )}
                </Text>
              )}
            </Box>
            <Box flex="1">
              {/*<CommentList*/}
              {/*  id={id}*/}
              {/*  content={editedContent}*/}
              {/*  highlightComment={scrollToHighlightedText}*/}
              {/*/>*/}
              <CommentPresenter targetId={id}
                                targetContent={editedContent}
                                isHost={isHost}
                                highlightComment={scrollToHighlightedText}
                                useCommentHook={commentHook}
                                />
            </Box>
          </Flex>
          {/*{!isEdit && <CommentInput id={id} />}*/}
          {!isEdit && <CommentInput commentHook={commentHook} />}
        </Box>
      </Container>

      <InviteModal isOpen={isOpen} onClose={onClose} />

      {/* Image Modal */}
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

export default DetailContent;
