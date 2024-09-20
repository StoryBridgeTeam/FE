import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {
  Box,
  Text,
  IconButton,
  VStack,
  Heading,
  Divider,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  useBreakpointValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Image,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton, HStack,
} from "@chakra-ui/react";
import { FiMoreHorizontal, FiEdit, FiTrash2, FiLink } from "react-icons/fi";
import { GETPOI, POI, usePOI } from "../hooks/usePOI";
import CommentList from "./CommentList";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import InviteModal from "../../../common/components/InviteModal";
import { renderContentWithIcons } from "../../info/components/renderContentWithIcons";
import { useCommentStore } from "../store/POIComment";
import { carouselSettings } from "../../amt/utils/carouselSetting";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {ImageRes} from "../../../common/hooks/useImage";
import CommentPresenter from "../../../common/components/comment/CommentPresenter";
import useComment, {Comment} from "../../../common/hooks/useComment";
import {createPOIComment, deleteComment, getPOIComments, linkPOICommentTag, updateComment} from "../api/poiAPI";
import CommentInput from "../../../common/components/comment/CommentInput";
import {VideoType} from "../../../common/api/videoAPI";
import videojs from "video.js";
import {use} from "i18next";
import VideoPlayerEditor from "../../../common/components/video/VideoPlayerEditor";
import VideoPlayer from "../../../common/components/video/VideoPlayer";

interface POIViewProps {
  poiId: string | undefined;
}

const POIView: React.FC<POIViewProps> = ({ poiId }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  const { nickName } = useParams<{ nickName: string }>();
  const savedNickName = localStorage.getItem("nickName");
  const isHost = nickName === savedNickName;
  const [poi, setPoi] = useState<GETPOI>();
  const { fetchPOI, loading, error, removePOI, formatTimestamp } = usePOI();
  const { showToast } = useToastMessage();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { comments } = useCommentStore();
  const {
    isOpen: isInviteModalOpen,
    onOpen: onInviteModalOpen,
    onClose: onInviteModalClose,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [selectedImage, setSelectedImage] = useState<ImageRes | null>(null);

  const useCommentHook = useComment({
    targetId: Number(poiId), fetchCommentAPI:getPOIComments, editCommentAPI:updateComment, deleteCommentAPI:deleteComment,tagCommentAPI:linkPOICommentTag, createCommentAPI:createPOIComment, token
  });

  const [video, setVideos] = useState<VideoType>();
  const playerRef = useRef<any>(null);

  useLayoutEffect(() => {
    if (video) {
      if (playerRef.current) {
        const videoOptions = {
          autoplay: false,
          controls: true,
          responsive: false,
          playbackRates: [0.5, 0.75, 1, 1.25, 1.5],
          controlBar: {
            playToggle: true,
            pictureInPictureToggle: false,
            remainingTimeDisplay: true,
            progressControl: true,
            qualitySelector: true,

            volumePanel: { inline: true },
          },
        };

        const player = videojs(
            playerRef.current,
            videoOptions,
            function onPlayerReady() {
              console.log("Video Player is ready");
            }
        );

        // player.poster(`${videoState?.video?.thumbnail?.fileUrl}`); //youtube thumbnail
        player.src({
          src : `${process.env.REACT_APP_VIDEO_SERVER}/resources/${video.path}`,
          type: "application/x-mpegURL",
        });

        return () => {
          if (player) {
            player.dispose();
          }
        };
      }
    }
  }, [video]);

  useEffect(() => {
    if (nickName && poiId) {
      if (token)
        fetchPOI(Number(poiId), token).then((data) => {
          setPoi(data)
          if (data.videos.length>0){
            setVideos(data.videos[0])
          }
        });
      else fetchPOI(Number(poiId)).then((data) => {
        setPoi(data)
        if (data.videos.length>0){
          setVideos(data.videos[0])
        }
      });
    }
  }, [nickName, poiId]);

  const handleRemovePOI = async () => {
    await removePOI(Number(poiId));
    setIsAlertOpen(false);
    navigate(`/${nickName}`);
    showToast("POI 삭제 성공", "POI가 성공적으로 삭제되었습니다.", "success");
  };

  const handleImageClick = (imgSrc: ImageRes) => {
    setSelectedImage(imgSrc);
    onModalOpen();
  };

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  const scrollToHighlightedComment = (
      startIndex?: number,
      endIndex?: number
  ) => {
    if (startIndex === undefined || endIndex === undefined) return;

    const comment = useCommentHook.comments.find(
        (c) =>
            c.tagInfo?.startIndex === startIndex &&
            c.tagInfo?.lastIndex === endIndex
    );
    if (comment) {
      const elementId = `comment-${comment.id}`;
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        console.warn(`Element with id '${elementId}' not found.`);
      }
    } else {
      console.warn("Comment not found with specified indexes.");
    }
  };

  const scrollToHighlightedText = (startIndex?: number, endIndex?: number) => {
    if (startIndex === undefined || endIndex === undefined) return;

    const highlightElements = document.querySelectorAll(`[id^='highlight-']`);
    highlightElements.forEach((element) => {
      const id = element.id.replace("highlight-", "");
      const comment = useCommentHook.comments.find((c) => c.id.toString() === id);
      if (
          comment?.tagInfo?.startIndex === startIndex &&
          comment?.tagInfo?.lastIndex === endIndex
      ) {
        (element as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  const processedComments = (comments:Comment[]) => comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    startIndex: comment.tagInfo?.startIndex || 0,
    endIndex: comment.tagInfo?.lastIndex || 0,
  }));

  return (
    <HStack w={"100%"} justifyContent={"center"}>
      <VStack spacing={4} align="stretch" w={"100%"} maxW={{base:"100%", md:"900px"}} minW={{base:"400px", md:"700px"}} p={6}>
        <Box position="relative" w="100%">
          <Heading
            size="lg"
            fontSize="2xl"
            fontWeight="bold"
            _placeholder={{ color: "#828282" }}
            textAlign="center"
          >
            {poi?.title}
          </Heading>
          {isHost && (
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <IconButton
                  icon={<FiMoreHorizontal />}
                  aria-label="Menu"
                  variant="ghost"
                  position="absolute"
                  right="0"
                  top="50%"
                  transform="translateY(-50%)"
                  size="lg"
                  fontSize={30}
                />
              </PopoverTrigger>
              <PopoverContent w={isMobile ? "200px" : "140px"}>
                <PopoverArrow />
                <PopoverBody display="flex" flexDirection="column" shadow="xl">
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    size={isMobile ? "md" : "sm"}
                    leftIcon={<FiEdit />}
                    onClick={() => navigate(`/${nickName}/poi/${poiId}/modify`, {state:{poi:poi}})}
                  >
                    편집
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    size={isMobile ? "md" : "sm"}
                    leftIcon={<FiTrash2 />}
                    onClick={openAlert}
                  >
                    삭제
                  </Button>
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    size={isMobile ? "md" : "sm"}
                    leftIcon={<FiLink />}
                    onClick={onInviteModalOpen}
                  >
                    초대링크
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}
        </Box>
        <Divider borderColor="#828282" borderWidth="1px" mt={5} />
        {poi?.updatedAt ? (
          <Text fontSize="sm" color="gray.500" textAlign="left">
            {formatTimestamp(poi?.updatedAt || "")} (수정됨)
          </Text>
        ) : (
          <Text fontSize="sm" color="gray.500" textAlign="left">
            {formatTimestamp(poi?.createdAt || "")} (생성됨)
          </Text>
        )}

        {poi?.images.length !== 0 && (
          <Box w={"80%"} margin={"auto"} minH={"30vh"} mb={12}>
            <Slider {...carouselSettings}>
              {poi?.images.map((imgSrc, index) => (
                <Box key={index} position="relative">
                  <Flex h="30vh" justifyContent="center" alignItems="center">
                    <Image
                      src={`http://image.storyb.kr/${imgSrc.path}`}
                      alt={imgSrc.name}
                      display="block"
                      maxH="30vh"
                      maxW="100%"
                      objectFit="contain"
                      borderRadius="10px"
                      onClick={() => handleImageClick(imgSrc)}
                    />
                  </Flex>
                </Box>
              ))}
            </Slider>
          </Box>
        )}
        {
          poi && poi.videos.length>0 &&
            <VideoPlayer video={poi.videos[0]}/>
        }
        {
          poi &&
            <Text px={6} py={5} whiteSpace={"pre-line"}>
              {renderContentWithIcons(
                  poi.content,
                  processedComments(useCommentHook.comments),
                  scrollToHighlightedComment
              )}
            </Text>
        }
        <Divider borderColor="#828282" borderWidth="1px" mt={5} />
        {/*{poiId && nickName && (*/}
        {/*  <CommentList*/}
        {/*    poiId={Number(poiId)}*/}
        {/*    nickName={nickName}*/}
        {/*    highlightComment={scrollToHighlightedText}*/}
        {/*  />*/}
        {/*)}*/}
        <CommentInput commentHook={useCommentHook} />
        {
          poi &&
            <CommentPresenter targetId={poi.id} targetContent={poi.content} isHost={isHost} highlightComment={scrollToHighlightedText} useCommentHook={useCommentHook} />
        }

        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeAlert}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                삭제 확인
              </AlertDialogHeader>

              <AlertDialogBody>
                이 항목을 정말로 삭제하시겠습니까? <br />이 작업은 되돌릴 수
                없습니다.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeAlert}>
                  취소
                </Button>
                <Button colorScheme="red" onClick={handleRemovePOI} ml={3}>
                  삭제
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {
          isInviteModalOpen &&
            <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose} />
        }
      </VStack>

      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {selectedImage && (
            <Image
              src={`http://image.storyb.kr/${selectedImage.path}`}
              alt={selectedImage.name}
              objectFit="contain"
            />
          )}
        </ModalContent>
      </Modal>
    </HStack>
  );
};

export default POIView;
