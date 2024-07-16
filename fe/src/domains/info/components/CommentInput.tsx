// CommentInput.tsx
import { Box, Container, Flex, Input, Button, Avatar } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { Send } from "tabler-icons-react";
import { useNormalCommentStore } from "../Store/NormalCommentStore";
import { useTranslation } from "react-i18next";

const CommentInput = () => {
  const [comment, setComment] = useState("");
  const addComment = useNormalCommentStore((state) => state.addComment);
  const commentsEndRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        text: comment,
        timestamp: new Date().toISOString(),
        username: "User Name",
      };
      addComment(newComment);
      setComment("");
      if (commentsEndRef.current) {
        commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommentSubmit();
    }
  };

  return (
    <Box
      position="absolute"
      bottom="0"
      left="0"
      width="100%"
      bg="white"
      border="1px solid #EEEEEE"
      p={4}
    >
      <Container maxW="4xl">
        <Flex alignItems="center">
          <Avatar
            size="md"
            name="User Name"
            src="https://image.idus.com/image/files/da17e0c53a4e480284c5d49932722e5a.jpg"
            mr={2}
          />
          <Input
            value={comment}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            placeholder={t(`info.commentPlaceHolder`)}
            mr={3}
          />
          <Button onClick={handleCommentSubmit}>
            <Send />
          </Button>
        </Flex>
      </Container>
      <div ref={commentsEndRef} />
    </Box>
  );
};

export default CommentInput;
