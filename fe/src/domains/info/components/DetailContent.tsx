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
} from "@chakra-ui/react";
import { Edit, Check, File, X } from "tabler-icons-react"; // X 아이콘 추가
import { useTranslation } from "react-i18next";
import { useTextSelection } from "../hook/useTextSelection";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { useCommentStore } from "../Store/CommentStore";
import { renderContentWithIcons } from "./renderContentWithIcons";
import { useProfileStore } from "../Store/useProfileStore";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCoverLetters, putCoverLetters } from "../api/InfoAPI";
import ProfileSidebar from "./ProfileSideBar";
import { deleteImage, uploadImage } from "../../../common/api/imageAPI";

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
  const id = idParam ? parseInt(idParam, 10) : NaN;
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const isHost = nickName === name;
  const navigate = useNavigate();

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

  return (
    <>
      {!isMobile && <ProfileSidebar />}
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
                <Button onClick={handleEditClick}>
                  <Edit size={24} color="black" />
                </Button>
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
              borderTopRadius="30"
              userSelect="text"
            >
              {images.length !== 0 && (
                <Flex
                  overflowX="auto"
                  mt={4}
                  mb={4}
                  p={2}
                  sx={{
                    "::-webkit-scrollbar": {
                      height: "8px",
                    },
                    "::-webkit-scrollbar-thumb": {
                      background: "#a0a0a0",
                      borderRadius: "8px",
                    },
                  }}
                >
                  {images.map((imgSrc, index) => (
                    <Box
                      key={index}
                      position="relative"
                      display="inline-block"
                      mr={2}
                    >
                      {isEdit && (
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
                      )}
                      <Image
                        src={`http://image.storyb.kr/${imgSrc.path}`}
                        alt={imgSrc.name}
                        display="block"
                        maxH="500px"
                        maxW="none" 
                        objectFit="contain"
                      />
                    </Box>
                  ))}
                </Flex>
              )}
              {isEdit ? (
                <Textarea
                  minH={"30vh"}
                  maxH="52vh"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  size="lg"
                />
              ) : (
                renderContentWithIcons(
                  editedContent,
                  processedComments,
                  scrollToHighlightedComment
                )
              )}
            </Box>
            <Box flex="1">
              <CommentList
                id={id}
                content={editedContent}
                highlightComment={scrollToHighlightedText}
              />
            </Box>
          </Flex>
          {!isEdit && <CommentInput id={id} />}
        </Box>{" "}
      </Container>
    </>
  );
};

export default DetailContent;
