import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Edit, Check } from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { renderContentWithHighlights } from "./renderContentWithHighlights";
import { useTextSelection } from "../hook/useTextSelection";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { useCommentStore } from "../Store/CommentStore";

interface DetailPageProps {
  id: number;
  data: { title: string; content: string };
  onSave: (id: number, updatedData: { title: string; content: string }) => void;
  onBack: () => void;
}

const DetailPage: React.FC<DetailPageProps> = ({
  id,
  data,
  onSave,
  onBack,
}) => {
  const {
    selectedText,
    handleMouseUp,
    handleClearSelectedText,
    handleCommentSubmit,
  } = useTextSelection();
  const { comments } = useCommentStore();
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [editedTitle, setEditedTitle] = useState(data.title);
  const [editedContent, setEditedContent] = useState(data.content);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    onSave(id, { title: editedTitle, content: editedContent });
    setIsEditing(false);
  };

  const scrollToHighlightedText = (startIndex?: number, endIndex?: number) => {
    const highlightElements = document.querySelectorAll(`[id^='highlight-']`);
    highlightElements.forEach((element) => {
      const id = element.id.replace("highlight-", "");
      const filteredComments = comments.filter(
        (comment) => comment.startIndex !== undefined
      );
      const comment = filteredComments[parseInt(id)];
      if (comment.startIndex === startIndex && comment.endIndex === endIndex) {
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
    const index = comments.findIndex(
      (comment) =>
        comment.startIndex === startIndex && comment.endIndex === endIndex
    );
    if (index !== -1) {
      const elementId = `comment-${index}`;
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.warn(`Element with id '${elementId}' not found.`);
      }
    } else {
      console.warn("Comment not found with specified indexes.");
    }
  };

  return (
    <Box
      mt={6}
      w="full"
      cursor="pointer"
      position="relative"
      onMouseUp={handleMouseUp}
      dir="col"
    >
      <Flex w="full" justifyContent="space-between" alignItems="center" mb={5}>
        <Button onClick={onBack}>{t(`info.list`)}</Button>
        {isEditing ? (
          <Button onClick={handleSaveClick}>
            <Check size={24} color="black" />
          </Button>
        ) : (
          <Button onClick={handleEditClick}>
            <Edit size={24} color="black" />
          </Button>
        )}
      </Flex>
      <Flex
        h={isMobile ? undefined : "calc(100vh - 165px)"}
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
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              fontSize="lg"
              fontWeight="bold"
            />
          ) : (
            <Text fontWeight="bold" fontSize={"lg"}>
              {data.title}
            </Text>
          )}
          <Box flex="1" borderBottom="2px" ml={2} />
        </Flex>
        <Box bg="#EEEEEE" mt={4} p={5} borderTopRadius="30" userSelect="text">
          {isEditing ? (
            <Textarea
              h={"52vh"}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              size="lg"
            />
          ) : (
            renderContentWithHighlights(
              data.content,
              comments,
              scrollToHighlightedComment
            )
          )}
        </Box>
        <Box flex="1">
          <CommentList
            content={data.content}
            highlightComment={scrollToHighlightedText}
          />
        </Box>
      </Flex>
      <CommentInput
        selectedText={selectedText}
        onSubmit={handleCommentSubmit}
        onClearSelectedText={handleClearSelectedText}
      />
    </Box>
  );
};

export default DetailPage;
