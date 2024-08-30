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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Tag,
  TagLabel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight, FaPaperPlane } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Trash, Edit, Link } from "tabler-icons-react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { SlideUpSmallModal } from "../../../common/components/SlideUpSmallModal";
import { Comment, useCard } from "../hooks/useCard";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { SlideUpModal } from "../../../common/components/SlideUpModal";
import { useTextSelection } from "../../info/hook/useTextSelection";
import { deleteComment, updateComment } from "../api/cardAPI";
import { useLocation } from "react-router-dom";
import { renderContentWithHighlights } from "../../info/components/renderContentWithHighlights";
import { useCommentStore } from "../store/CardComment";

interface CommentListProps {
  cardId: number;
  nickName: string;
}

const CommentList: React.FC<CommentListProps> = ({ cardId, nickName }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const name = localStorage.getItem("nickName");
  const ishost = nickName === name;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isConnectOpen,
    onOpen: onConnectOpen,
    onClose: onConnectClose,
  } = useDisclosure();
  const {
    isOpen: isNicknameOpen,
    onOpen: onNicknameOpen,
    onClose: onNicknameClose,
  } = useDisclosure();
  const {
    fetchComments,
    addComment,
    loading,
    error,
    totalCommentPages,
    currentCommentPage,
    formatTimestamp,
  } = useCard();
  const savedNickName = localStorage.getItem("nickName");
  const { t } = useTranslation();
  const { showToast } = useToastMessage();
  const {
    selectedText,
    handleClearSelectedText,
    handleMouseUp,
    handleTouchEnd,
  } = useTextSelection();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { setCardComments } = useCommentStore();
  const [nickname, setNickname] = useState(savedNickName || "");

  const loadComments = async (page = 0) => {
    try {
      let data1;
      let data;
      if (token) {
        data = await fetchComments(cardId, page, 10, token);
      } else {
        data = await fetchComments(cardId, page, 10);
      }
      setComments(data);
      setCardComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [cardId]);

  const handleAddComment = async () => {
    if (!nickname) {
      onNicknameOpen();
      return;
    }
    if (newComment.trim()) {
      try {
        const response = token
          ? await addComment(cardId, nickname!, newComment, token)
          : await addComment(cardId, savedNickName!, newComment);

        setNewComment("");
        await loadComments();
      } catch (err) {
        console.error("Failed to add comment", err);
      }
    }
    onNicknameClose();
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

  const handleNicknameSubmit = () => {
    if (nickname.trim()) {
      setNickname(nickname);
      handleAddComment();
    }
  };

  const handleEdit = (index: number, text: string) => {
    setEditIndex(index);
    setEditText(text);
    onOpen();
  };

  const handleConnect = (index: number, text: string) => {
    onConnectOpen();
  };

  const handleSave = async () => {
    if (editIndex !== null) {
      await updateComment(editIndex, editText);
      loadComments();
      setEditIndex(null);
      setEditText("");
      onClose();
      showToast(
        t(`info.commentUpdated`),
        t(`info.commentUpdatedMessage`),
        "success"
      );
    }
  };

  return (
    <>
      <Box
        border="1px"
        borderColor="#EEEEEE"
        p={4}
        mb={"82px"}
        h={"100%"}
        overflowY="auto"
        bg="gray.50"
      >
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
                // bg="#E9E9E9"
                bg="blue.300"
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
              <HStack
                key={comment.id}
                alignItems="flex-start"
                spacing={4}
                id={`comment-${comment.id}`}
              >
                <Avatar
                  src={
                    comment.img
                      ? `http://image.storyb.kr/${comment.img}`
                      : `/images/profile.png`
                  }
                />
                <Box>
                  <HStack spacing={4}>
                    <Text fontWeight="bold">{comment.user}</Text>
                    <Text fontSize="xs" color="#B4BBC6">
                      {formatTimestamp(comment.timestamp)}
                    </Text>
                    {(ishost || comment.user === name) && (
                      <Menu>
                        <MenuButton
                          as={Button}
                          variant="ghost"
                          size="xs"
                          aria-label="More options"
                          rightIcon={<BiDotsVerticalRounded />}
                          p={0}
                          m={0}
                          minW={0}
                        />
                        <MenuList>
                          {ishost && (
                            <MenuItem
                              icon={<Link />}
                              onClick={() =>
                                handleConnect(comment.id, comment.content)
                              }
                            >
                              Connect
                            </MenuItem>
                          )}
                          <MenuItem
                            icon={<Edit />}
                            onClick={() =>
                              handleEdit(comment.id, comment.content)
                            }
                          >
                            Edit
                          </MenuItem>
                          <MenuItem
                            icon={<Trash />}
                            onClick={async () => {
                              await deleteComment(comment.id);
                              loadComments();
                              showToast(
                                t(`info.commentDelete`),
                                t(`info.commentDeleteMessage`),
                                "success"
                              );
                            }}
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    )}
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
      </Box>
      <SlideUpSmallModal
        isOpen={isOpen}
        onClose={onClose}
        title={t(`info.editCommnet`)}
        footerContent={
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleSave}>
              Save
            </Button>
          </>
        }
      >
        <Box>
          <Input
            placeholder="Enter text to edit"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
        </Box>
      </SlideUpSmallModal>

      <Modal isOpen={isNicknameOpen} onClose={onNicknameClose} isCentered>
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
    </>
  );
};

export default CommentList;
