import {
    Avatar,
    Box,
    Button,
    Flex, IconButton, Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, Spinner,
    Stack,
    Tag,
    TagLabel,
    Text, useBreakpointValue, useDisclosure
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {BiDotsVerticalRounded} from "react-icons/bi";
import {Edit, Link, Trash} from "tabler-icons-react";
import {deleteCommentServer} from "../../../domains/info/api/CommentAPI";
import ImagePresenter from "../image/ImagePresenter";
import {formatTimestamp} from "../../utils/time";
import {useTranslation} from "react-i18next";
import {getHighlightedText} from "../../utils/commentUtils";
import useComment, {Comment, UseCommentReturn} from "../../hooks/useComment";
import {SlideUpModal} from "../SlideUpModal";
import {renderContentWithHighlights} from "../../../domains/info/components/renderContentWithHighlights";
import {UseDisclosureReturn} from "@chakra-ui/hooks/dist/use-disclosure";
import {useTextSelection} from "../../../domains/info/hook/useTextSelection";
import {SlideUpSmallModal} from "../SlideUpSmallModal";
import {useToastMessage} from "../../hooks/useToastMessage";
import ImageUploader from "../image/ImageUploader";
import {useImage} from "../../hooks/useImage";
import {AddIcon, LinkIcon} from "@chakra-ui/icons";

interface CommentItemProps{
    targetId:number,
    content:string,
    comment:Comment,
    ishost:boolean,
    useCommentHook : UseCommentReturn
    highlightComment: (startIndex: number, endIndex: number) => void;
}

const CommentItem = ({targetId, content, comment, ishost, highlightComment, useCommentHook}:CommentItemProps) => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { t } = useTranslation();
    const connectDisclosure = useDisclosure({onClose : useCommentHook.clearSelectedComment});
    const editDisclosure = useDisclosure({onClose:useCommentHook.clearSelectedComment});

    const {showToast} = useToastMessage();

    const name = localStorage.getItem("nickName");
    const handleTagClick = (
        startIndex: number | undefined,
        endIndex: number | undefined
    ) => {
        if (startIndex !== undefined && endIndex !== undefined) {
            highlightComment(startIndex, endIndex);
        }
    };

    return <Box key={comment.id} id={`comment-${comment.id}`} bgColor={"white"} padding={2}>
        <Flex align="center">
            <Avatar
                size="sm"
                src={
                    comment.author.profileImage !== null
                        ? `http://image.storyb.kr/${comment.author.profileImage.path}`
                        : `/images/profile.png`
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
                {formatTimestamp(comment.createdTime)}
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
                        {ishost && content.trim()!=="" && (
                            <MenuItem
                                icon={<Link />}
                                onClick={() =>
                                    useCommentHook.handleOnClickConnect(comment, connectDisclosure.onOpen)
                                }
                            >
                                Connect
                            </MenuItem>
                        )}
                        <MenuItem
                            icon={<Edit />}
                            onClick={() => useCommentHook.handleOnClickEdit(comment, editDisclosure.onOpen)}
                        >
                            Edit
                        </MenuItem>
                        <MenuItem
                            icon={<Trash />}
                            onClick={() => useCommentHook.handleDeleteSave(comment, ()=>showToast(
                                    t(`info.commentDelete`),
                                    t(`info.commentDeleteMessage`),
                            "success"
                            ))}
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
                            content,
                            comment.tagInfo.startIndex,
                            comment.tagInfo.lastIndex
                        )}
                    </TagLabel>
                </Tag>
            )}
        {
            comment.images.length>0 ?
                (isMobile ?
                        <>
                            <ImagePresenter images={comment.images} />
                            <Text marginLeft={10} pr={5}>
                                {comment.content}
                            </Text>
                        </>
                        :
                        <Stack direction={"row"} padding={5}>
                            <Box w={"50%"}>
                                <ImagePresenter images={comment.images} />
                            </Box>
                            <Text marginLeft={10} w={"50%"}>
                                {comment.content}
                            </Text>
                        </Stack>
                )
                :
                <Text marginLeft={10}>
                    {comment.content}
                </Text>
        }
        {
            useCommentHook.selectedComment &&
            <>
                <EditModal editDisclosure={editDisclosure} useComment={useCommentHook}/>
                <ConnectModal connectDisclosure={connectDisclosure} useComment={useCommentHook} targetContent={content}/>
            </>
        }
    </Box>
};

interface EditModalProps{
    editDisclosure : UseDisclosureReturn
    useComment : UseCommentReturn,
}

const EditModal  = ({editDisclosure, useComment}:EditModalProps) => {
    const { isOpen ,onOpen, onClose} = editDisclosure;
    const { t } = useTranslation();
    const {showToast} = useToastMessage();

    const [editText, setEditText] = useState<string>(useComment.selectedComment?useComment.selectedComment.content : "");
    const imageHook = useImage(useComment.selectedComment?.images);

    return <SlideUpModal
        isOpen={isOpen}
        onClose={onClose}
        title={t(`info.editCommnet`)}
        footerContent={
            <>
                <Button variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button colorScheme="blue" ml={3} onClick={() => useComment.handleEditSave(
                        editText,
                        onClose,
                        ()=>showToast(
                            t(`info.commentUpdated`),
                            t(`info.commentUpdatedMessage`),
                            "success"
                        ),
                        imageHook.images.map(i => i.id)
                    )}>
                    Save
                </Button>
            </>
        }
    >
        <Box>
            {
                imageHook.loading ?
                    <Flex justifyContent={"center"} alignItems={"center"} padding={4}>
                        <Spinner />
                    </Flex>
                    :
                    <>
                        <ImageUploader imageHook={imageHook} />
                        {
                            imageHook.images.length==0 &&
                            <Flex w={"100%"} alignItems={"center"} justifyContent={"center"} padding={3}>
                                <Button leftIcon={<AddIcon />} fontSize={14} onClick={() => imageHook.handleUploadImage("COMMENT")}>
                                    {t("info.commentImageBtn")}
                                </Button>
                            </Flex>
                        }
                    </>
            }
            <Input
                placeholder="Enter text to edit"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
            />
        </Box>
    </SlideUpModal>
}

interface ConnectModalProps{
    connectDisclosure : UseDisclosureReturn,
    useComment : UseCommentReturn,
    targetContent: string
}

const ConnectModal = ({connectDisclosure, useComment, targetContent}:ConnectModalProps) => {
    const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose, } = connectDisclosure;
    const { t } = useTranslation();
    const {showToast} = useToastMessage();
    const {
        selectedText,
        handleClearSelectedText,
        handleMouseUp,
        handleTouchEnd,
    } = useTextSelection();

    return <SlideUpModal
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
                        useComment.handleConnectReset(onConnectClose, () => showToast(
                            t(`info.commentConnectedReset`),
                            t(`info.commentConnectedMessageReset`),
                            "success"
                        ));
                        handleClearSelectedText();
                    }}
                >
                    Reset
                </Button>
                <Button
                    colorScheme="blue"
                    ml={3}
                    onClick={() => {
                        useComment.handleConnectSave(selectedText, onConnectClose, ()=>showToast(
                                t(`info.commentConnected`),
                                t(`info.commentConnectedMessage`),
                                "success"
                        ));
                        handleClearSelectedText();
                    }}
                >
                    Save
                </Button>
            </>
        }
    >
        <Box onMouseUp={handleMouseUp} onTouchEnd={handleTouchEnd}>
            {renderContentWithHighlights(targetContent, useComment.comments)}
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
}

export default CommentItem;