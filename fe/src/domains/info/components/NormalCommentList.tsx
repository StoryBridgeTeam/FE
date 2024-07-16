import {
  Box,
  Flex,
  Avatar,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Trash, Edit } from "tabler-icons-react";
import { formatDistanceToNow } from "date-fns";
import { useNormalCommentStore } from "../Store/NormalCommentStore";
import { useEffect, useRef, useState } from "react";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

const NormalCommentList = () => {
  const { comments, deleteComment, updateComment } = useNormalCommentStore();
  const commentsEndRef = useRef<HTMLDivElement | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useToastMessage();

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
      showToast("Comment Updatd", "Your Comment has been updated", "success");
    }
  };

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  return (
    <>
      <Box border="1px" borderColor="#EEEEEE" minH="28vh" p={4} mb={"82px"}>
        {comments.map((comment, index) => (
          <Box marginBottom={5} key={index}>
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
                    onClick={() => deleteComment(index)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
            <Text mt={1} marginLeft={10} pr={5}>
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

export default NormalCommentList;
