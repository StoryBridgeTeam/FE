import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Flex,
  Input,
  Button,
  Avatar,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Send } from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { postComment } from "../api/CommentAPI";
import { useCommentStore } from "../Store/CommentStore";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { getCardProfile } from "../api/SideBarAPI";

interface CommentInputProps {
  id: number;
}

const CommentInput: React.FC<CommentInputProps> = ({ id }) => {
  const { addComments } = useCommentStore();
  const [comment, setComment] = useState("");
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const storedNickname = localStorage.getItem("nickName");
  const [nickname, setNickname] = useState(storedNickname || "");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { showToast } = useToastMessage();
  const [image, setImage] = useState<string>();

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        if (!token) {
          const image = await getCardProfile(nickname!);
          setImage(image.path);
        }
      } catch (error) {
        console.error("Card error:", error);
      }
    };

    fetchCardData();
  }, []);

  const handleCommentSubmit = async () => {
    if (!nickname) {
      onOpen();
      return;
    }

    if (comment.trim()) {
      try {
        const response = token
          ? await postComment(
              id,
              { nickName: nickname, content: comment },
              token
            )
          : await postComment(id, { nickName: nickname, content: comment });

        if (response) {
          addComments(response);
          setComment("");
        }
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          error.response?.data?.code === 2260300
        ) {
          showToast(
            "초대링크 제한",
            "초대링크당 하나의 댓글만 달 수 있습니다",
            "error"
          );
        } else {
          showToast(
            "Error",
            "댓글을 등록하는 중 오류가 발생했습니다.",
            "error"
          );
        }
      }
    }
    onClose(); // Close the modal if it was open
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommentSubmit();
    }
  };

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      setNickname(nickname);
      handleCommentSubmit();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("info.enterNickname")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder={t("info.nicknamePlaceHolder")}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleNicknameSubmit}>
              {t("info.submit")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
                src={
                  image
                    ? `http://image.storyb.kr/${image}`
                    : `/images/profile.png`
                }
                mr={2}
              />
            )}

            <Box flex="1" mr={3}>
              <Input
                value={comment}
                onChange={handleCommentChange}
                onKeyDown={handleKeyDown}
                placeholder={t("info.commentPlaceHolder")}
              />
            </Box>
            <Button onClick={handleCommentSubmit}>
              <Send />
            </Button>
          </Flex>
        </Container>
      </Box>
    </>
  );
};

export default CommentInput;
