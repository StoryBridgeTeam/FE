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
  useBreakpointValue,
  Spacer,
} from "@chakra-ui/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Trash, Edit } from "tabler-icons-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { useTagCommentStore } from "../Store/TagCommentStore";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

interface TagComment {
  text: string;
  timestamp: string;
  username: string;
}

interface TagCommentListProps {
  highlightedComment: TagComment | null;
}

const TagCommentList: React.FC<TagCommentListProps> = ({
  highlightedComment,
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { comments, deleteComment, updateComment } = useTagCommentStore();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showToast } = useToastMessage();
  const [highlightedCommentId, setHighlightedCommentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (highlightedComment) {
      // Find the index of the highlighted comment
      const index = comments.findIndex(
        (comment) => comment.text === highlightedComment.text
      );
      if (index !== -1) {
        setHighlightedCommentId(index);
        // Remove the highlight after 3 seconds
        const timer = setTimeout(() => {
          setHighlightedCommentId(null);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [highlightedComment, comments]);

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
      showToast("Comment Updated", "Your Comment has been updated", "success");
    }
  };

  return (
    <>
      <Box border="1px" borderColor="#EEEEEE" minH="28vh" p={4} mb={"82px"}>
        {comments.map((comment, index) => (
          <Flex
            justifyContent={"flex-end"}
            key={index}
            p={2}
            borderRadius="md"
            transition="background-color 0.3s ease"
          >
            <Box
              marginBottom={5}
              key={index}
              w={isMobile ? "70vw" : "30vw"}
              bg={highlightedCommentId === index ? "yellow.100" : "transparent"}
              p={2}
            >
              <Flex align="center" justifyContent={"space-around"}>
                <Flex>
                  <Avatar
                    size="sm"
                    name={comment.username}
                    src="https://image.idus.com/image/files/da17e0c53a4e480284c5d49932722e5a.jpg"
                    mr={3}
                  />
                  <Text fontWeight="bold">{comment.username}</Text>
                </Flex>
                <Spacer />
                <Flex>
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
              </Flex>
              <Text mt={1} marginLeft={10} pr={5}>
                {comment.text}
              </Text>
            </Box>
          </Flex>
        ))}
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

export default TagCommentList;
