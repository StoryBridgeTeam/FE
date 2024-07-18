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
import { Trash, Edit } from "tabler-icons-react";
import { formatDistanceToNow } from "date-fns";
import { useCommentStore } from "../Store/CommentStore";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { useTranslation } from "react-i18next";

interface CommentListProps {
  content: string;
  highlightComment: (startIndex: number, endIndex: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  content,
  highlightComment,
}) => {
  const { comments, deleteComment, updateComment } = useCommentStore();
  const commentsEndRef = useRef<HTMLDivElement | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useToastMessage();
  const { t } = useTranslation();
  const handleEdit = (index: number, text: string) => {
    setEditIndex(index);
    setEditText(text);
    onOpen();
  };

  const handleSave = () => {
    if (editIndex !== null) {
      updateComment(editIndex, editText);
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

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

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
              comment.endIndex !== undefined && (
                <Tag
                  mt={1}
                  size="md"
                  fontSize="xs"
                  colorScheme="gray"
                  borderRadius="full"
                  mb={2}
                  marginLeft={10}
                  pr={5}
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
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
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
    </>
  );
};

export default CommentList;
