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
} from "@chakra-ui/react";
import { Edit, Check } from "tabler-icons-react";
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

interface CoverLetter {
  id: string;
  title: string;
  content: string;
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
      const response: CoverLettersResponse = await getCoverLetters(nickName);
      const { entries } = response;
      if (entries.content === null) {
        navigate(`/${nickName}/info`);
      } else {
        const data = entries.content.find(
          (item) => parseInt(item.id, 10) === id
        );
        if (data) {
          setEditedTitle(data.title);
          setEditedContent(data.content);
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

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSaveClick = async () => {
    await putCoverLetters(nickName!, {
      id,
      title: editedTitle,
      content: editedContent,
    });

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
      {isMobile ? undefined : <ProfileSidebar />}
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
                navigate(`/${nickName}/info`);
              }}
            >
              {t("info.list")}
            </Button>
            {isEdit ? (
              <Button onClick={handleSaveClick}>
                <Check size={24} color="black" />
              </Button>
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
              {isEdit ? (
                <Textarea
                  h="52vh"
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
