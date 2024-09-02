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
import { Comment, usePOI } from "../hooks/usePOI";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { SlideUpModal } from "../../../common/components/SlideUpModal";
import { useTextSelection } from "../../info/hook/useTextSelection";
import {
  deleteComment,
  getPOI,
  linkPOICommentTag,
  updateComment,
} from "../api/poiAPI";
import { useLocation } from "react-router-dom";
import { renderContentWithHighlights } from "../../info/components/renderContentWithHighlights";
import { useCommentStore } from "../store/POIComment";
import {AddIcon, LinkIcon} from "@chakra-ui/icons";
import {useImage} from "../../../common/hooks/useImage";
import ImageUploader from "../../../common/components/image/ImageUploader";
import ImagePresenter from "../../../common/components/image/ImagePresenter";

interface CommentListProps {
  poiId: number;
  nickName: string;
  highlightComment: (startIndex: number, endIndex: number) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  poiId,
  nickName,
  highlightComment,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [content, setContent] = useState("");
  const [connectIndex, setConnectIndex] = useState<number | null>(null);
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
    // fetchComments,
    // addComment,
    loading,
    error,
    totalCommentPages,
    currentCommentPage,
    formatTimestamp,
  } = usePOI();
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
  const { setPOIComments } = useCommentStore();
  const [nickname, setNickname] = useState(savedNickName || "");
  const imageHook = useImage();

  // const loadComments = async (page = 0) => {
  //   try {
  //     let data1;
  //     let data;
  //     if (token) {
  //       data = await fetchComments(poiId, page, 10, token);
  //       data1 = await getPOI(poiId, token);
  //     } else {
  //       data = await fetchComments(poiId, page, 10);
  //       data1 = await getPOI(poiId);
  //     }
  //     setComments(data);
  //     setPOIComments(data);
  //     setContent(data1.data.content);
  //
  //   } catch (err) {
  //     console.error("Failed to fetch comments", err);
  //   }
  // };

  // useEffect(() => {
  //   loadComments();
  // }, [poiId]);
  //
  // const handleAddComment = async () => {
  //   if (!nickname) {
  //     onNicknameOpen();
  //     return;
  //   }
  //   if (newComment.trim()) {
  //     try {
  //       const response = token
  //         ? await addComment(poiId, nickname!, newComment, token)
  //         : await addComment(poiId, savedNickName!,
  //               newComment,
  //               "",
  //               imageHook.images.map(i => Number(i.id))
  //           );
  //
  //       setNewComment("");
  //       imageHook.clearImage();
  //       await loadComments();
  //     } catch (err) {
  //       console.error("Failed to add comment", err);
  //     }
  //   }
  //   onNicknameClose();
  // };

  // const handlePageChange = (newPage: number) => {
  //   loadComments(newPage);
  // };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  // const handleNicknameSubmit = () => {
  //   if (nickname.trim()) {
  //     setNickname(nickname);
  //     handleAddComment();
  //   }
  // };

  const handleEdit = (index: number, text: string) => {
    setEditIndex(index);
    setEditText(text);
    onOpen();
  };

  const handleConnect = (index: number, text: string) => {
    setConnectIndex(index);
    onConnectOpen();
  };

  // const handleSave = async () => {
  //   if (editIndex !== null) {
  //     await updateComment(editIndex, editText);
  //     loadComments();
  //     setEditIndex(null);
  //     setEditText("");
  //     onClose();
  //     showToast(
  //       t(`info.commentUpdated`),
  //       t(`info.commentUpdatedMessage`),
  //       "success"
  //     );
  //   }
  // };
  //
  // const handleConnectReset = async () => {
  //   if (connectIndex !== null) {
  //     await linkPOICommentTag(poiId, connectIndex, 0, 0);
  //     loadComments();
  //     handleClearSelectedText();
  //     setConnectIndex(null);
  //     onConnectClose();
  //     showToast(
  //       t(`info.commentConnectedReset`),
  //       t(`info.commentConnectedMessageReset`),
  //       "success"
  //     );
  //   }
  // };

  // const handleConnectSave = async () => {
  //   if (connectIndex !== null && selectedText) {
  //     await linkPOICommentTag(
  //       poiId,
  //       connectIndex,
  //       selectedText.startIndex,
  //       selectedText.endIndex
  //     );
  //     loadComments();
  //
  //     handleClearSelectedText();
  //     setConnectIndex(null);
  //     onConnectClose();
  //     showToast(
  //       t(`info.commentConnected`),
  //       t(`info.commentConnectedMessage`),
  //       "success"
  //     );
  //   }
  // };

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

  const processedComments = comments.map((comment) => ({
    content: comment.content,
    startIndex: comment.tagInfo?.startIndex || 0,
    endIndex: comment.tagInfo?.lastIndex || 0,
  }));

  return (
    <>
      {/*<Box*/}
      {/*  border="1px"*/}
      {/*  borderColor="#EEEEEE"*/}
      {/*  p={4}*/}
      {/*  mb={"82px"}*/}
      {/*  h={"100%"}*/}
      {/*  overflowY="auto"*/}
      {/*>*/}
      {/*  <VStack spacing={4} align="stretch">*/}
      {/*    <ImageUploader imageHook={imageHook} />*/}
      {/*    <HStack>*/}
      {/*      <Input*/}
      {/*          placeholder="댓글을 입력하세요"*/}
      {/*          bg="#E9E9E9"*/}
      {/*          value={newComment}*/}
      {/*          onChange={(e) => setNewComment(e.target.value)}*/}
      {/*          onKeyDown={(e) => {*/}
      {/*            if (e.key === "Enter") {*/}
      {/*              handleAddComment();*/}
      {/*            }*/}
      {/*          }}*/}
      {/*      />*/}
      {/*      <Menu>*/}
      {/*        <MenuButton*/}
      {/*            as={IconButton}*/}
      {/*            icon={<AddIcon />}*/}
      {/*        />*/}
      {/*        <MenuList>*/}
      {/*          <MenuItem icon={<LinkIcon />}*/}
      {/*                    onClick={() => imageHook.handleUploadImage("COMMENT")}*/}
      {/*          >*/}
      {/*            {t("info.commentImageBtn")}*/}
      {/*          </MenuItem>*/}
      {/*        </MenuList>*/}
      {/*      </Menu>*/}
      {/*      <IconButton*/}
      {/*          bg="#E9E9E9"*/}
      {/*          size="md"*/}
      {/*          icon={<FaPaperPlane />}*/}
      {/*          aria-label="Send comment"*/}
      {/*          onClick={handleAddComment}*/}
      {/*      />*/}
      {/*    </HStack>*/}
      {/*    {comments.length === 0 ? (*/}
      {/*      <Text color="gray.500" align="center">*/}
      {/*        첫 번째 댓글을 남겨보세요!*/}
      {/*      </Text>*/}
      {/*    ) : (*/}
      {/*      comments.map((comment) => (*/}
      {/*        <VStack*/}
      {/*          key={comment.id}*/}
      {/*          alignItems="flex-start"*/}
      {/*          spacing={1}*/}
      {/*          id={`comment-${comment.id}`}*/}
      {/*          w={"100%"}*/}
      {/*        >*/}
      {/*          <HStack>*/}
      {/*            <Avatar name={comment.user} size={"sm"} />*/}
      {/*            <Box>*/}
      {/*              <HStack spacing={4}>*/}
      {/*                <Text fontWeight="bold">{comment.user}</Text>*/}
      {/*                <Text fontSize="xs" color="#B4BBC6">*/}
      {/*                  {formatTimestamp(comment.timestamp)}*/}
      {/*                </Text>*/}
      {/*                {(ishost || comment.user === name) && (*/}
      {/*                    <Menu>*/}
      {/*                      <MenuButton*/}
      {/*                          as={Button}*/}
      {/*                          variant="ghost"*/}
      {/*                          size="xs"*/}
      {/*                          aria-label="More options"*/}
      {/*                          rightIcon={<BiDotsVerticalRounded />}*/}
      {/*                          p={0}*/}
      {/*                          m={0}*/}
      {/*                          minW={0}*/}
      {/*                      />*/}
      {/*                      <MenuList>*/}
      {/*                        {ishost && (*/}
      {/*                            <MenuItem*/}
      {/*                                icon={<Link />}*/}
      {/*                                onClick={() =>*/}
      {/*                                    handleConnect(comment.id, comment.content)*/}
      {/*                                }*/}
      {/*                            >*/}
      {/*                              Connect*/}
      {/*                            </MenuItem>*/}
      {/*                        )}*/}
      {/*                        <MenuItem*/}
      {/*                            icon={<Edit />}*/}
      {/*                            onClick={() =>*/}
      {/*                                handleEdit(comment.id, comment.content)*/}
      {/*                            }*/}
      {/*                        >*/}
      {/*                          Edit*/}
      {/*                        </MenuItem>*/}
      {/*                        <MenuItem*/}
      {/*                            icon={<Trash />}*/}
      {/*                            onClick={async () => {*/}
      {/*                              await deleteComment(comment.id);*/}
      {/*                              loadComments();*/}
      {/*                              showToast(*/}
      {/*                                  t(`info.commentDelete`),*/}
      {/*                                  t(`info.commentDeleteMessage`),*/}
      {/*                                  "success"*/}
      {/*                              );*/}
      {/*                            }}*/}
      {/*                        >*/}
      {/*                          Delete*/}
      {/*                        </MenuItem>*/}
      {/*                      </MenuList>*/}
      {/*                    </Menu>*/}
      {/*                )}*/}
      {/*              </HStack>*/}
      {/*            </Box>*/}
      {/*          </HStack>*/}
      {/*          {comment.tagInfo &&*/}
      {/*              (comment.tagInfo.startIndex !== 0 ||*/}
      {/*                  comment.tagInfo.lastIndex !== 0) && (*/}
      {/*                  <Tag*/}
      {/*                      ml={10}*/}
      {/*                      mt={1}*/}
      {/*                      size="md"*/}
      {/*                      fontSize="xs"*/}
      {/*                      colorScheme="gray"*/}
      {/*                      borderRadius="full"*/}
      {/*                      cursor="pointer"*/}
      {/*                      onClick={() =>*/}
      {/*                          handleTagClick(*/}
      {/*                              comment.tagInfo!.startIndex,*/}
      {/*                              comment.tagInfo!.lastIndex*/}
      {/*                          )*/}
      {/*                      }*/}
      {/*                  >*/}
      {/*                    <TagLabel color={"gray"}>*/}
      {/*                      {getHighlightedText(*/}
      {/*                          comment.tagInfo.startIndex,*/}
      {/*                          comment.tagInfo.lastIndex*/}
      {/*                      )}*/}
      {/*                    </TagLabel>*/}
      {/*                  </Tag>*/}
      {/*              )}*/}
      {/*          <Box paddingLeft={10} w={"100%"} boxSizing={"border-box"}>*/}
      {/*            {*/}
      {/*              comment.images.length> 0 ?*/}
      {/*                  <HStack  boxSizing={"border-box"} w={"100%"}>*/}
      {/*                    <Box w={"50%"}>*/}
      {/*                      <ImagePresenter images={comment.images} arrowSize={12}/>*/}
      {/*                    </Box>*/}
      {/*                    <Text w={"50%"} mt={2}>{comment.content}</Text>*/}
      {/*                  </HStack>*/}
      {/*                  :*/}
      {/*                  <Text mt={2}>{comment.content}</Text>*/}
      {/*            }*/}
      {/*          </Box>*/}
      {/*        </VStack>*/}
      {/*      ))*/}
      {/*    )}*/}
      {/*    {totalCommentPages === 0 ? null : (*/}
      {/*      <HStack justify="space-between" mt={4} mb={-6}>*/}
      {/*        <IconButton*/}
      {/*          aria-label="Previous Page"*/}
      {/*          icon={<FaChevronLeft />}*/}
      {/*          onClick={() => handlePageChange(currentCommentPage - 1)}*/}
      {/*          isDisabled={currentCommentPage === 0}*/}
      {/*          bg="white"*/}
      {/*        />*/}
      {/*        <Text>{`${currentCommentPage + 1} / ${totalCommentPages}`}</Text>*/}
      {/*        <IconButton*/}
      {/*          aria-label="Next Page"*/}
      {/*          icon={<FaChevronRight />}*/}
      {/*          onClick={() => handlePageChange(currentCommentPage + 1)}*/}
      {/*          isDisabled={currentCommentPage === totalCommentPages - 1}*/}
      {/*          bg="white"*/}
      {/*        />*/}
      {/*      </HStack>*/}
      {/*    )}*/}
      {/*  </VStack>*/}
      {/*</Box>*/}
      {/*<SlideUpSmallModal*/}
      {/*  isOpen={isOpen}*/}
      {/*  onClose={onClose}*/}
      {/*  title={t(`info.editCommnet`)}*/}
      {/*  footerContent={*/}
      {/*    <>*/}
      {/*      <Button variant="ghost" onClick={onClose}>*/}
      {/*        Cancel*/}
      {/*      </Button>*/}
      {/*      <Button colorScheme="blue" ml={3} onClick={handleSave}>*/}
      {/*        Save*/}
      {/*      </Button>*/}
      {/*    </>*/}
      {/*  }*/}
      {/*>*/}
      {/*  <Box>*/}
      {/*    <Input*/}
      {/*      placeholder="Enter text to edit"*/}
      {/*      value={editText}*/}
      {/*      onChange={(e) => setEditText(e.target.value)}*/}
      {/*    />*/}
      {/*  </Box>*/}
      {/*</SlideUpSmallModal>*/}
      {/*<SlideUpModal*/}
      {/*  isOpen={isConnectOpen}*/}
      {/*  onClose={onConnectClose}*/}
      {/*  title={t(`info.connectComment`)}*/}
      {/*  footerContent={*/}
      {/*    <>*/}
      {/*      <Button*/}
      {/*        variant="ghost"*/}
      {/*        onClick={() => {*/}
      {/*          onConnectClose();*/}
      {/*          handleClearSelectedText();*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Cancel*/}
      {/*      </Button>*/}
      {/*      <Button*/}
      {/*        colorScheme="yellow"*/}
      {/*        ml={3}*/}
      {/*        onClick={() => {*/}
      {/*          handleConnectReset();*/}
      {/*          handleClearSelectedText();*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Reset*/}
      {/*      </Button>*/}
      {/*      <Button*/}
      {/*        colorScheme="blue"*/}
      {/*        ml={3}*/}
      {/*        onClick={() => {*/}
      {/*          handleConnectSave();*/}
      {/*          handleClearSelectedText();*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Save*/}
      {/*      </Button>*/}
      {/*    </>*/}
      {/*  }*/}
      {/*>*/}
      {/*  <Box onMouseUp={handleMouseUp} onTouchEnd={handleTouchEnd}>*/}
      {/*    /!*{renderContentWithHighlights(content, processedComments)}*!/*/}
      {/*  </Box>*/}
      {/*  {selectedText && (*/}
      {/*    <Tag*/}
      {/*      mt={7}*/}
      {/*      size="lg"*/}
      {/*      fontSize="md"*/}
      {/*      colorScheme="gray"*/}
      {/*      borderRadius="full"*/}
      {/*      mb={4}*/}
      {/*      cursor="pointer"*/}
      {/*    >*/}
      {/*      {selectedText && selectedText.text}*/}
      {/*    </Tag>*/}
      {/*  )}*/}
      {/*</SlideUpModal>*/}

      {/*<Modal isOpen={isNicknameOpen} onClose={onNicknameClose} isCentered>*/}
      {/*  <ModalOverlay />*/}
      {/*  <ModalContent>*/}
      {/*    <ModalHeader>{t("info.enterNickname")}</ModalHeader>*/}
      {/*    <ModalCloseButton />*/}
      {/*    <ModalBody>*/}
      {/*      <Input*/}
      {/*        placeholder={t("info.nicknamePlaceHolder")}*/}
      {/*        value={nickname}*/}
      {/*        onChange={(e) => setNickname(e.target.value)}*/}
      {/*      />*/}
      {/*    </ModalBody>*/}
      {/*    <ModalFooter>*/}
      {/*      <Button colorScheme="blue" onClick={handleNicknameSubmit}>*/}
      {/*        {t("info.submit")}*/}
      {/*      </Button>*/}
      {/*    </ModalFooter>*/}
      {/*  </ModalContent>*/}
      {/*</Modal>*/}
    </>
  );
};

export default CommentList;
