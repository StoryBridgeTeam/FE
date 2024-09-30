import {
    Avatar,
    Box, Button,
    Container,
    Flex,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, Spinner,
    Stack, useBreakpointValue
} from "@chakra-ui/react";
import ImageUploader from "../image/ImageUploader";
import {AddIcon, CheckIcon, LinkIcon} from "@chakra-ui/icons";
import {Send} from "tabler-icons-react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useImage} from "../../hooks/useImage";
import {UseCommentReturn} from "../../hooks/useComment";
import {useToastMessage} from "../../hooks/useToastMessage";
import {useAuthStore} from "../../stores/AuthStore";
import {useLocation} from "react-router-dom";

export interface CommentInputProps{
    commentHook : UseCommentReturn;
}

const CommentInput = ({commentHook}:CommentInputProps) =>{
    const [nickname, setNickname] = useState<string>("");
    const [commentText, setCommentText] = useState<string>("");

    const {isTokenUser, profileImage } = useAuthStore();

    const { t } = useTranslation();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const {showToast} = useToastMessage();

    const imageHook = useImage();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCommentSubmit();
        }
    };

    const handleCommentSubmit = () => {
        if(commentText.trim()){
            if(isTokenUser && !nickname.trim()){
                showToast("닉네임 입력", "닉네임을 입력해주세요", "error");
                return;
            }

            commentHook.handleCreateComment(
                commentText, () => showToast(
                    t(`info.commentRegister`),
                    t(`info.commentRegisterMessage`),
                    "success"
                ), nickname, imageHook.images.map(i => i.id)
            )
            setCommentText("")
            setNickname("");
            imageHook.clearImage();
        }else{
            showToast("댓글 입력", "댓글을 입력해주세요", "error");
            return;
        }
    }

    return <Box
        position={isMobile ? "fixed" : "relative"}
        bottom={0}
        left={0}
        width="100%"
        zIndex={10}
        bg="white"
        border="1px solid #EEEEEE"
        p={isMobile ? 2 : 2}
    >
        <Container maxW="4xl" padding={0}>
            <Flex>
                {
                    imageHook.loading ?
                        <Stack alignItems={"center"} justifyContent={"center"} padding={4} w={"100%"}>
                            <Spinner/>
                        </Stack> :
                        <ImageUploader imageHook={imageHook} imageType={"COMMENT"} />
                }
            </Flex>
            <Flex alignItems="center">
                {!isTokenUser && (
                    <Avatar
                        size="sm"
                        src={
                            profileImage
                                ? `http://image.storyb.kr/${profileImage.path}`
                                : `/images/profile.png`
                        }
                        mr={2}
                    />
                )}
                <Flex gap={2} flex="1" mr={3}>
                    {
                        isTokenUser &&
                        <Box flex={1}>
                            <Input
                                padding={2}
                                fontSize={12}
                                textAlign={"left"}
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                placeholder={t("comment.anonymousNicknameInput")}
                            />
                        </Box>
                    }
                    <Box flex={5}>
                        <Input
                            fontSize={12}
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={t("info.commentPlaceHolder")}
                        />
                    </Box>
                </Flex>
                <Stack gap={2} direction={"row"} alignItems={"center"}>
                    {
                        !isTokenUser &&
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                icon={<AddIcon />}
                                fontSize={12}
                                size={"sm"}
                            />
                            <MenuList>
                                <MenuItem icon={<LinkIcon fontSize={12}/>}
                                          onClick={() => imageHook.handleUploadImage("COMMENT")}
                                          fontSize={12}
                                >
                                    {t("info.commentImageBtn")}
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    }
                    <Button size={"sm"} onClick={handleCommentSubmit}>
                        <CheckIcon fontSize={12}/>
                    </Button>
                </Stack>
            </Flex>
        </Container>
    </Box>
}

export default CommentInput;