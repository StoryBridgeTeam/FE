import React, { useEffect, useRef, useState } from "react";
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
  useDisclosure,
  Tag,
  TagLabel,
  Spinner,
} from "@chakra-ui/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Trash, Edit, Link } from "tabler-icons-react";
import { formatDistanceToNow } from "date-fns";
import { useCommentStore } from "../Store/CommentStore";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { useTranslation } from "react-i18next";
import { renderContentWithHighlights } from "./renderContentWithHighlights";
import { useTextSelection } from "../hook/useTextSelection";
import { SlideUpModal } from "../../../common/components/SlideUpModal";
import { SlideUpSmallModal } from "../../../common/components/SlideUpSmallModal";
import {
  getComments,
  deleteCommentServer,
  updateComment,
  tagComment,
} from "../api/CommentAPI";
import { useLocation, useParams } from "react-router-dom";

interface CommentListProps {
  id: number;
  content: string;
  highlightComment: (startIndex: number, endIndex: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  id,
  content,
  highlightComment,
}) => {
  const {
    comments,
    setComments,
    deleteComment,
    updateCommentText,
    updateCommentIndexes,
  } = useCommentStore();

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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const name = localStorage.getItem("nickName");
  const { nickName } = useParams<{ nickName: string }>();

  const ishost = nickName === name;

  const { t } = useTranslation();
  const {
    selectedText,
    handleClearSelectedText,
    handleMouseUp,
    handleTouchEnd,
  } = useTextSelection();

  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCommentData(page);
  }, [id, page]);

  const fetchCommentData = async (page: number) => {
    try {
      setLoading(true);
      let response;
      if (token) {
        response = await getComments(id, page, token);
      } else {
        response = await getComments(id, page);
      }
      if (page > 0 && response && response.length > 0) {
        setComments([...comments, ...response]);
      } else if (response && response.length > 0) {
        setComments(response);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("comment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number, text: string) => {
    setEditIndex(index);
    setEditText(text);
    onOpen();
  };

  const handleConnect = (index: number, text: string) => {
    setConnectIndex(index);
    onConnectOpen();
  };

  const handleSave = async () => {
    if (editIndex !== null) {
      await updateComment(editIndex, editText);
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

  const handleConnectReset = async () => {
    if (connectIndex !== null) {
      await tagComment(id, connectIndex, { startIndex: 0, lastIndex: 0 });
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

  const handleConnectSave = async () => {
    if (connectIndex !== null && selectedText) {
      await tagComment(id, connectIndex, {
        startIndex: selectedText.startIndex,
        lastIndex: selectedText.endIndex,
      });
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

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const processedComments = comments.map((comment) => ({
    content: comment.content,
    startIndex: comment.tagInfo?.startIndex || 0,
    endIndex: comment.tagInfo?.lastIndex || 0,
  }));

  return (
    <>
      <Box
        ref={scrollRef}
        border="1px"
        borderColor="#EEEEEE"
        p={4}
        mb={"82px"}
        h={"100%"}
        overflowY="auto"
        onScroll={handleScroll} // Add scroll event listener
      >
        {comments.map((comment) => (
          <Box marginBottom={5} key={comment.id} id={`comment-${comment.id}`}>
            <Flex align="center">
              <Avatar
                size="sm"
                src={
                  comment.author.profileImage !== null
                    ? `http://image.storyb.kr/${comment.author.profileImage.path}`
                    : `images/profile.png`
                }
                mr={3}
              />
              <Text fontWeight="bold">{comment.author.nickName}</Text>
              <Text
                fontSize="xs"
                color="gray.500"
                mr={2}
                lineHeight={"xl"}
                ml={3}
              >
                {formatDistanceToNow(new Date(comment.createdTime))} ago
              </Text>
              {(ishost || comment.author.nickName === name) && (
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
                      onClick={() => handleEdit(comment.id, comment.content)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      icon={<Trash />}
                      onClick={async () => {
                        await deleteCommentServer(comment.id);
                        deleteComment(comment.id);
                        await fetchCommentData(0);
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
            </Flex>
            {comment.tagInfo &&
              (comment.tagInfo.startIndex !== 0 ||
                comment.tagInfo.lastIndex !== 0) && (
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
                    handleTagClick(
                      comment.tagInfo!.startIndex,
                      comment.tagInfo!.lastIndex
                    )
                  }
                >
                  <TagLabel color={"gray"}>
                    {getHighlightedText(
                      comment.tagInfo.startIndex,
                      comment.tagInfo.lastIndex
                    )}
                  </TagLabel>
                </Tag>
              )}
            <Text marginLeft={10} pr={5}>
              {comment.content}
            </Text>
          </Box>
        ))}
        {loading && (
          <Flex justifyContent="center" mt={4}>
            <Spinner />
          </Flex>
        )}
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

      <SlideUpModal
        isOpen={isConnectOpen}
        onClose={onConnectClose}
        title={t(`info.connectComment`)}
        footerContent={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                onConnectClose();
                handleClearSelectedText();
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="yellow"
              ml={3}
              onClick={() => {
                handleConnectReset();
                handleClearSelectedText();
              }}
            >
              Reset
            </Button>
            <Button
              colorScheme="blue"
              ml={3}
              onClick={() => {
                handleConnectSave();
                handleClearSelectedText();
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <Box onMouseUp={handleMouseUp} onTouchEnd={handleTouchEnd}>
          {renderContentWithHighlights(content, processedComments)}
        </Box>
        {selectedText && (
          <Tag
            mt={7}
            size="lg"
            fontSize="md"
            colorScheme="gray"
            borderRadius="full"
            mb={4}
            cursor="pointer"
          >
            {selectedText && selectedText.text}
          </Tag>
        )}
      </SlideUpModal>
    </>
  );
};

export default CommentList;
