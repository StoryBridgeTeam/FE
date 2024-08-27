import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaPaperPlane } from "react-icons/fa";

import { Comment, usePOI } from "../hooks/usePOI";

interface CommentListProps {
  poiId: number;
  nickName: string;
}

const CommentList: React.FC<CommentListProps> = ({ poiId, nickName }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const {
    fetchComments,
    addComment,
    loading,
    error,
    totalCommentPages,
    currentCommentPage,
    formatTimestamp,
  } = usePOI();
  const savedNickName = localStorage.getItem("nickName");

  const loadComments = async (page = 0) => {
    try {
      const data = await fetchComments(poiId, page, 10); //화면 비율 고려하여 7?
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [poiId]);

  const handleAddComment = async () => {
    if (newComment.trim() !== "") {
      try {
        await addComment(poiId, savedNickName!, newComment);
        setNewComment("");
        await loadComments(); //첫 페이지로 이동
      } catch (err) {
        console.error("Failed to add comment", err);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    loadComments(newPage);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <VStack spacing={4} align="stretch">
      <InputGroup mb={4}>
        <Input
          placeholder="댓글을 입력하세요"
          bg="#E9E9E9"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddComment();
            }
          }}
        />
        <InputRightElement>
          <IconButton
            bg="#E9E9E9"
            size="md"
            icon={<FaPaperPlane />}
            aria-label="Send comment"
            onClick={handleAddComment}
          />
        </InputRightElement>
      </InputGroup>

      {comments.length === 0 ? (
        <Text color="gray.500" align="center">
          첫 번째 댓글을 남겨보세요!
        </Text>
      ) : (
        comments.map((comment) => (
          <HStack key={comment.id} alignItems="flex-start" spacing={4}>
            <Avatar name={comment.user} />
            <Box>
              <HStack spacing={4}>
                <Text fontWeight="bold">{comment.user}</Text>
                <Text fontSize="xs" color="#B4BBC6">
                  {formatTimestamp(comment.timestamp)}
                </Text>
              </HStack>

              <Text mt={2}>{comment.content}</Text>
            </Box>
          </HStack>
        ))
      )}
      {totalCommentPages === 0 ? null : (
        <HStack justify="space-between" mt={4} mb={-6}>
          <IconButton
            aria-label="Previous Page"
            icon={<FaChevronLeft />}
            onClick={() => handlePageChange(currentCommentPage - 1)}
            isDisabled={currentCommentPage === 0}
            bg="white"
          />
          <Text>{`${currentCommentPage + 1} / ${totalCommentPages}`}</Text>
          <IconButton
            aria-label="Next Page"
            icon={<FaChevronRight />}
            onClick={() => handlePageChange(currentCommentPage + 1)}
            isDisabled={currentCommentPage === totalCommentPages - 1}
            bg="white"
          />
        </HStack>
      )}
    </VStack>
  );
};

export default CommentList;
