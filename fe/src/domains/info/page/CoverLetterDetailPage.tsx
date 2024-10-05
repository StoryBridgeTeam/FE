import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel,
    Box,
    Button,
    Divider,
    Flex,
    HStack,
    IconButton,
    Image,
    Input,
    Spinner, Tag,
    Text,
    Textarea, useBreakpointValue, useDisclosure,
    VStack
} from "@chakra-ui/react";
import InfoPageLayout from "../InfoPageLayout";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ImageRes} from "../../../common/hooks/useImage";
import {deleteCoverLetters, getCoverLetterEntry} from "../api/InfoAPI";
import {AddIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";
import ImageUploader from "../../../common/components/image/ImageUploader";
import Slider from "react-slick";
import {carouselSettings} from "../../amt/utils/carouselSetting";
import {renderContentWithIcons} from "../components/renderContentWithIcons";
import CommentPresenter from "../../../common/components/comment/CommentPresenter";
import useComment, {Comment} from "../../../common/hooks/useComment";
import {deleteCommentServer, getComments, postComment, tagComment, updateComment} from "../api/CommentAPI";
import CommentInput from "../../../common/components/comment/CommentInput";
import {SlideUpModal} from "../../../common/components/SlideUpModal";
import {renderContentWithHighlights} from "../components/renderContentWithHighlights";
import {SlideUpSmallModal} from "../../../common/components/SlideUpSmallModal";

interface CoverLetter {
    id: number;
    title: string;
    content: string;
    images?: ImageRes[];
}

const CoverLetterDetailPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const navigate = useNavigate();

    const { nickName="", id:strId } = useParams<{ nickName: string, id:string }>();
    const name = localStorage.getItem("nickName");
    const isHost = nickName === name;

    const [loading, setLoading] = useState<boolean>(true);
    const [coverLetterEntry, setCoverLetterEntry] = useState<CoverLetter>();
    const commentHook = useComment(
        {
            targetId:Number(strId), fetchCommentAPI:getComments, editCommentAPI:updateComment, deleteCommentAPI:deleteCommentServer, tagCommentAPI:tagComment, createCommentAPI:postComment, token
        });

    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        if(strId){
            fetchData();
        }
    }, []);

    const deleteCoverLetter = async () => {
        setLoading(true);
        await deleteCoverLetters(nickName, Number(strId));
        onClose();
        if(token){
            navigate(`/${nickName}/info?token=${token}`)
        }else{
            navigate(`/${nickName}/info`)
        }
        setLoading(false);
    }

    const fetchData = async () => {
        setLoading(true);
        const data = await getCoverLetterEntry(Number(strId), token);
        setCoverLetterEntry(data);
        setLoading(false);
    }

    const processedComments = (comments:Comment[]) => comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        startIndex: comment.tagInfo?.startIndex || 0,
        endIndex: comment.tagInfo?.lastIndex || 0,
    }));

    const scrollToHighlightedText = (startIndex?: number, endIndex?: number) => {
        if (startIndex === undefined || endIndex === undefined) return;

        const highlightElements = document.querySelectorAll(`[id^='highlight-']`);
        highlightElements.forEach((element) => {
            const id = element.id.replace("highlight-", "");
            const comment = commentHook.comments.find((c) => c.id.toString() === id);
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

    const scrollToHighlightedComment = (
        startIndex?: number,
        endIndex?: number
    ) => {
        if (startIndex === undefined || endIndex === undefined) return;

        const comment = commentHook.comments.find(
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

    if(loading){
        return <InfoPageLayout nickname={nickName} showProfile={!isMobile}>
            <Flex justifyContent={"center"} alignItems={"center"} padding={4}>
                <Spinner />
            </Flex>
        </InfoPageLayout>
    }

    return <InfoPageLayout nickname={nickName} showProfile={!isMobile}>
        <VStack w={"100%"} alignItems={"center"} padding={4}>
            <Box maxW={"600px"} w={"100%"}>
                <Flex justifyContent={"right"} gap={2}>
                    {
                        isHost &&
                        <>
                            <IconButton aria-label={"edit"} fontSize={14} size={"sm"} color={"red"} variant={"outline"} onClick={onOpen}>
                                <DeleteIcon />
                            </IconButton>
                            <IconButton aria-label={"edit"} fontSize={14} size={"sm"} variant={"outline"} onClick={() => navigate(`/${nickName}/info/${coverLetterEntry?.id}/edit`, {state : {entry:coverLetterEntry}})}>
                                <EditIcon />
                            </IconButton>
                        </>
                    }
                </Flex>
                <Text padding={2} size={"lg"} fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"}>
                    {coverLetterEntry?.title}
                </Text>
                <Divider borderColor="#828282" borderWidth="1px" />
                    {
                        coverLetterEntry?.images?.length!=0 &&
                        <Box m={"auto"} minH={"30vh"} w={"80%"} padding={5} >
                        <Slider {...carouselSettings}>
                            {
                                coverLetterEntry?.images?.map((imgSrc, index) => (
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
                                                // onClick={() => handleImageClick(imgSrc)}
                                            />
                                        </Flex>
                                    </Box>
                                ))
                            }
                        </Slider>
                        </Box>
                    }
                {
                    coverLetterEntry &&
                    <Text minHeight={"200px"} padding={3}
                          whiteSpace={"pre-line"}

                    >
                        {
                        renderContentWithIcons(
                        coverLetterEntry.content,
                        processedComments(commentHook.comments),
                        scrollToHighlightedComment
                        )
                    }
                    </Text>
                }
                <Accordion allowToggle>
                    <AccordionItem>
                        {
                            ({isExpanded}) => (
                                <>
                                    <AccordionButton>
                                        <Box>
                                            {
                                                isExpanded ? "댓글 접기" : "댓글 보기"
                                            }
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <CommentInput commentHook={commentHook} />
                                        {
                                            coverLetterEntry &&
                                            <CommentPresenter targetId={coverLetterEntry.id}
                                                              targetContent={coverLetterEntry.content}
                                                              isHost={isHost}
                                                              highlightComment={scrollToHighlightedText}
                                                              useCommentHook={commentHook}
                                            />
                                        }
                                    </AccordionPanel>
                                </>
                            )
                        }
                    </AccordionItem>
                </Accordion>
            </Box>
        </VStack>

        <SlideUpSmallModal
        isOpen={isOpen}
        onClose={onClose}
        title={"삭제"}
        footerContent={
            <>
                <Button
                    variant="ghost"
                    onClick={() => {onClose();}}
                >
                    Cancel
                </Button>
                <Button
                    colorScheme="red"
                    ml={3}
                    onClick={deleteCoverLetter}
                >
                    Delete
                </Button>
            </>
        }
    >
            삭제하면 복구할 수 없습니다. 삭제하시겠습니까?
    </SlideUpSmallModal>
    </InfoPageLayout>
}

export default CoverLetterDetailPage;