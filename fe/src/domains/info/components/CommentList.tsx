import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Trash, Edit, Link } from "tabler-icons-react";
import { formatDistanceToNow } from "date-fns";
import { useCommentStore } from "../Store/CommentStore";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { useTranslation } from "react-i18next";
import { renderContentWithHighlights } from "./renderContentWithHighlights";
import { useTextSelection } from "../hook/useTextSelection";

interface CommentListProps {
  content: string;
  highlightComment: (startIndex: number, endIndex: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  content,
  highlightComment,
}) => {
  const { comments, deleteComment, updateCommentText, updateCommentIndexes } =
    useCommentStore();
  const commentsEndRef = useRef<HTMLDivElement | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [connectIndex, setConnectIndex] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isConnectOpen,
    onOpen: onConnectOpen,
    onClose: onConnectClose,
  } = useDisclosure();
  const { showToast } = useToastMessage();
  const { t } = useTranslation();
  const {
    selectedText,
    handleClearSelectedText,
    handleMouseUp,
    handleTouchEnd,
  } = useTextSelection();

  const handleEdit = (index: number, text: string) => {
    setEditIndex(index);
    setEditText(text);
    onOpen();
  };

  const handleConnect = (index: number, text: string) => {
    setConnectIndex(index);
    onConnectOpen();
  };

  const handleSave = () => {
    if (editIndex !== null) {
      updateCommentText(editIndex, editText);
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

  const handleConnectReset = () => {
    if (connectIndex !== null) {
      updateCommentIndexes(connectIndex, 0, 0);
      handleClearSelectedText();
      setConnectIndex(null);
      onConnectClose();
      showToast(
        t(`info.commentConnectedReset`),
        t(`info.commentConnectedMessageReset`),
        "success"
      );
    }
  };

  const handleConnectSave = () => {
    if (connectIndex !== null && selectedText) {
      updateCommentIndexes(
        connectIndex,
        selectedText.startIndex,
        selectedText.endIndex
      );
      handleClearSelectedText();
      setConnectIndex(null);
      onConnectClose();
      showToast(
        t(`info.commentConnected`),
        t(`info.commentConnectedMessage`),
        "success"
      );
    }
  };

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments.length]);

  const getHighlightedText = (startIndex?: number, endIndex?: number) => {
    if (startIndex !== undefined && endIndex !== undefined) {
      return content.substring(startIndex, endIndex);
    }
    return "";
  };

  const handleTagClick = (
    startIndex: number | undefined,
    endIndex: number | undefined
  ) => {
    if (startIndex !== undefined && endIndex !== undefined) {
      highlightComment(startIndex, endIndex);
    }
  };

  return (
    <>
      <Box border="1px" borderColor="#EEEEEE" p={4} mb={"82px"} h={"100%"}>
        {comments.map((comment, index) => (
          <Box marginBottom={5} key={index} id={`comment-${index}`}>
            <Flex align="center">
              <Avatar
                size="sm"
                name={comment.username}
                src="https://image.idus.com/image/files/da17e0c53a4e480284c5d49932722e5a.jpg"
                mr={3}
              />
              <Text fontWeight="bold">{comment.username}</Text>
              <Text
                fontSize="xs"
                color="gray.500"
                mr={2}
                lineHeight={"xl"}
                ml={3}
              >
                {formatDistanceToNow(new Date(comment.timestamp))} ago
              </Text>
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
                  <MenuItem
                    icon={<Link />}
                    onClick={() => handleConnect(index, comment.text)}
                  >
                    Connect
                  </MenuItem>
                  <MenuItem
                    icon={<Edit />}
                    onClick={() => handleEdit(index, comment.text)}
                  >
                    Edit
                  </MenuItem>
                  <MenuItem
                    icon={<Trash />}
                    onClick={() => {
                      deleteComment(index);
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
            </Flex>
            {comment.startIndex !== undefined &&
              comment.endIndex !== undefined &&
              (comment.startIndex !== 0 || comment.endIndex !== 0) && (
                <Tag
                  mt={1}
                  size="md"
                  fontSize="xs"
                  colorScheme="gray"
                  borderRadius="full"
                  mb={2}
                  marginLeft={10}
                  cursor="pointer"
                  onClick={() =>
                    handleTagClick(comment.startIndex, comment.endIndex)
                  }
                >
                  <TagLabel color={"gray"}>
                    {getHighlightedText(comment.startIndex, comment.endIndex)}
                  </TagLabel>
                </Tag>
              )}
            <Text marginLeft={10} pr={5}>
              {comment.text}
            </Text>
          </Box>
        ))}
        <div ref={commentsEndRef} />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Comment</ModalHeader>
          <ModalBody>
            <Box>
              <Input
                placeholder="Enter text to edit"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isConnectOpen} onClose={onConnectClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Comment</ModalHeader>
          <ModalBody>
            {selectedText && (
              <Tag
                size="md"
                fontSize="xs"
                colorScheme="gray"
                borderRadius="full"
                mb={4}
                cursor="pointer"
              >
                {selectedText && selectedText.text}
              </Tag>
            )}
            <Box onMouseUp={handleMouseUp} onTouchEnd={handleTouchEnd}>
              {renderContentWithHighlights(content, comments)}
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => {
                onConnectClose();
                handleClearSelectedText();
              }}
            >
              Cancel
            </Button>
            <Button colorScheme="yellow" ml={3} onClick={handleConnectReset}>
              Reset
            </Button>
            <Button colorScheme="blue" ml={3} onClick={handleConnectSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentList;
