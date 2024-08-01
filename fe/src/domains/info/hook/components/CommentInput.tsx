import React, { useState } from "react";
import {
  Box,
  Container,
  Flex,
  Input,
  Button,
  Avatar,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Send } from "tabler-icons-react";
import { useTranslation } from "react-i18next";

interface CommentInputProps {
  onSubmit: (text: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ onSubmit }) => {
  const [comment, setComment] = useState("");
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment("");
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
      p={isMobile ? 2 : 4}
    >
      <Container maxW="4xl">
        <Flex alignItems="center">
          {!isMobile && (
            <Avatar
              size="md"
              name="User Name"
              src="https://image.idus.com/image/files/da17e0c53a4e480284c5d49932722e5a.jpg"
              mr={2}
            />
          )}

          <Box flex="1" mr={3}>
            <Input
              value={comment}
              onChange={handleCommentChange}
              onKeyDown={handleKeyDown}
              placeholder={t(`info.commentPlaceHolder`)}
            />
          </Box>
          <Button onClick={handleCommentSubmit}>
            <Send />
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default CommentInput;
