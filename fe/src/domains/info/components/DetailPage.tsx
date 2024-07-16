import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Flex,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@chakra-ui/react";
import { initialComments, mockData } from "../infoData";
import CommentInput from "./CommentInput";
import NormalCommentList from "./NormalCommentList";
import { useTranslation } from "react-i18next";
import TagCommentList from "./TagCommentList";
import { useTagCommentStore } from "../Store/TagCommentStore";
import { useNormalCommentStore } from "../Store/NormalCommentStore";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

interface DetailPageProps {
  id: number;
}

interface TagComment {
  text: string;
  timestamp: string;
  username: string;
  startIndex: number;
  endIndex: number;
}

const DetailPage: React.FC<DetailPageProps> = ({ id }) => {
  const addComment = useTagCommentStore((state) => state.addComment);
  const comments = useTagCommentStore((state) => state.comments);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const setInitialComments = useNormalCommentStore(
    (state) => (comments: any) => {
      state.comments = comments;
    }
  );
  const { t } = useTranslation();
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);
  const [highlightedComment, setHighlightedComment] =
    useState<TagComment | null>(null);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToastMessage();

  useEffect(() => {
    setInitialComments(initialComments);
  }, [setInitialComments]);

  useEffect(() => {
    if (highlightedComment && contentRef.current) {
      // Calculate the position to scroll into view
      const content = mockData.content;
      const highlightStart = highlightedComment.startIndex;
      const highlightEnd = highlightedComment.endIndex;

      // Calculate the start and end positions
      const startElement = contentRef.current.querySelector(
        `mark[data-start="${highlightStart}"]`
      );
      const endElement = contentRef.current.querySelector(
        `mark[data-end="${highlightEnd}"]`
      );

      if (startElement && endElement) {
        const element = startElement as HTMLElement;
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightedComment]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    if (text && selection?.rangeCount) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const fullText = startContainer.parentElement?.innerText || "";

      const start = fullText.indexOf(text);
      const end = start + text.length;

      setSelectedText(text);
      setStartIndex(start);
      setEndIndex(end);
      if (selectedText && startIndex !== null && endIndex !== null) {
        const hasOverlap = comments.some(
          (comment) =>
            (startIndex >= comment.startIndex &&
              startIndex < comment.endIndex) ||
            (endIndex > comment.startIndex && endIndex <= comment.endIndex)
        );
        if (hasOverlap) {
          showToast(
            "error",
            "Comment overlaps with an existing comment. Please adjust the range",
            "error"
          );
        } else {
          setIsModalOpen(true);
        }
      }
    }
  };

  const handleMouseUp = () => handleTextSelection();
  const handleTouchEnd = () => handleTextSelection();
  const handleClose = () => {
    setIsModalOpen(false);
    setComment("");
    setSelectedText(null);
    setStartIndex(null);
    setEndIndex(null);
    setHighlightedComment(null);
  };

  const handleSaveComment = () => {
    if (
      comment.trim() &&
      selectedText &&
      startIndex !== null &&
      endIndex !== null
    ) {
      const newComment = {
        text: comment,
        timestamp: new Date().toISOString(),
        username: "User Name",
        startIndex: startIndex,
        endIndex: endIndex,
      };

      const hasOverlap = comments.some(
        (comment) =>
          (startIndex >= comment.startIndex && startIndex < comment.endIndex) ||
          (endIndex > comment.startIndex && endIndex <= comment.endIndex)
      );

      if (!hasOverlap) {
        addComment(newComment);
        setComment("");
        handleClose();
      } else {
        showToast(
          "errer",
          "Comment overlaps with an existing comment. Please adjust the range",
          "error"
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveComment();
    }
  };

  const handleHighlightedTextClick = (comment: TagComment) => {
    setHighlightedComment(comment);
  };

  const renderTextWithHighlights = () => {
    const content = mockData.content;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const sortedComments = [...comments].sort(
      (a, b) => a.startIndex - b.startIndex
    );

    sortedComments.forEach((comment, index) => {
      if (lastIndex < comment.startIndex) {
        parts.push(content.slice(lastIndex, comment.startIndex));
      }

      parts.push(
        <Text
          as="mark"
          key={index}
          bg="yellow.200"
          data-start={comment.startIndex}
          data-end={comment.endIndex}
          onClick={() => handleHighlightedTextClick(comment)}
          cursor="pointer"
        >
          {content.slice(comment.startIndex, comment.endIndex)}
        </Text>
      );

      lastIndex = comment.endIndex;
    });

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return <Text ref={contentRef}>{parts}</Text>;
  };

  return (
    <Box mt={6} w="full" cursor="pointer" position="relative">
      <Box
        h={isMobile ? undefined : "calc(100vh - 144px)"}
        overflowY="auto"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <Flex alignItems="center">
          <Text fontWeight="bold" fontSize={"lg"}>
            {mockData.title}
          </Text>
          <Box flex="1" borderBottom="2px" ml={2} />
        </Flex>
        <Box
          bg="#EEEEEE"
          mt={4}
          p={5}
          borderTopRadius="30"
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          userSelect="text"
        >
          {renderTextWithHighlights()}
          <TagCommentList highlightedComment={highlightedComment} />
        </Box>
        <Box>
          <NormalCommentList />
        </Box>
      </Box>
      <CommentInput />

      <Modal isOpen={isModalOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Comment on Selected Text</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={2}>
              <b>Selected Text:</b> {selectedText}
            </Text>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t(`info.commentPlaceHolder`)}
              onKeyDown={handleKeyDown}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveComment}>
              Save Comment
            </Button>

            <Button variant="ghost" onClick={handleClose}>
              {highlightedComment ? "Close" : "Cancel"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DetailPage;
