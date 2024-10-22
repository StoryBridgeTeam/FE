import React, {useEffect} from "react";
import {
    Box,
    Text,
    Flex,
    Input,
    useBreakpointValue,
    InputGroup,
    InputLeftElement,
    Avatar,
    IconButton,
    HStack, AvatarBadge, useToast,
} from "@chakra-ui/react";
import {FaRegBell, FaSearch} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import {getNicknameToken} from "../utils/nickname";
import {IoIosLogOut} from "react-icons/io";
import {useAuthStore} from "../stores/AuthStore";
import {useToastMessage} from "../hooks/useToastMessage";
import SearchBar from "./search/SearchBar";
import { IoChatboxOutline } from "react-icons/io5";
import {ChatAlarmStore} from "../../domains/chat/store/GlobalChatStore";
import {useChatAlarmToast} from "../../domains/chat/hook/useChatAlarmToast";
import {useErrorStore} from "../stores/ErrorStore";

interface LoginAppBarProps {
    isShowSearch?: boolean;
}

const LoginAppBar: React.FC<LoginAppBarProps> = ({isShowSearch}) => {
    const {t} = useTranslation();
    const isMobile = useBreakpointValue({base: true, md: false});
    const appBarHeight = isMobile ? "50px" : "60px";
    const navigate = useNavigate();
    let {nickName} = useParams<{ nickName: string }>();
    const location = useLocation();

    const {unReadMessages, unAlarmMessage, consumeAlarmMsg} = ChatAlarmStore();

    const {showToast} = useToastMessage();

    const {isAuthenticated, isTokenUser, profileImage, logout} = useAuthStore();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const type = queryParams.get("type");

    const {alarmChat} = useChatAlarmToast();

    useEffect(() => {
        if(unAlarmMessage){
            alarmChat(unAlarmMessage);
            consumeAlarmMsg();
        }
    }, [unAlarmMessage]);

    const toast = useToast();
    const errorStore = useErrorStore();

    useEffect(() => {
        if(errorStore.hasError){
            const title = errorStore.title;
            const content = errorStore.content;
            errorStore.consumeError();
            toast({title:title, description:content, status:"error",
                duration: 1500,
                isClosable: true,
            })
            navigate("/")
        }
    }, [errorStore.hasError]);

    const handleNavigate = () => {
        if (token) {
            const url = `/${nickName}`;
            const searchParams = new URLSearchParams();
            searchParams.append("token", token);
            navigate(`${url}?${searchParams.toString()}`, {replace: true});
        } else {
            nickName = localStorage.getItem("nickName") || getNicknameToken();
            navigate(`/${nickName}`);
        }
    };

    return (
        <Flex
            w="full"
            h={appBarHeight}
            borderBottom="1px"
            borderColor="#CDCDCD"
            justify="space-between"
            direction="row"
            position="fixed"
            top="0"
            bg="white"
            zIndex="1000"
            alignItems="center"
        >
            <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                w={"100%"}
                maxW={"1400px"}
                m={"0 auto"}
                boxSizing={"content-box"}
            >
                <Text
                    fontSize={isMobile ? "md" : "2xl"}
                    fontWeight="900"
                    align={"center"}
                    paddingLeft={isMobile ? "15px" : "20px"}
                    cursor={"pointer"}
                    onClick={handleNavigate}
                >
                    StoryBridge
                </Text>
                {isShowSearch && !isMobile && (
                    <Flex flex="1" justify="center" alignItems="center" mr={20}>
                        <SearchBar isShowSearch={isShowSearch}/>
                    </Flex>
                )}
                <Flex direction="row" alignItems="center" gap={5}>
                    {isShowSearch && isMobile && (
                        <Text
                            marginLeft={3}
                            fontSize={isMobile ? "xs" : "md"}
                            lineHeight={appBarHeight}
                            fontWeight="400"
                            cursor="pointer"
                            onClick={() => {
                            }}
                            as={FaSearch}
                        ></Text>
                    )}
                    {!token && isAuthenticated && !isTokenUser && (
                        <Avatar
                            icon={<IoChatboxOutline fontSize={"24px"}/>}
                            bgColor={"white"}
                            color={"gray.800"}
                            size={"sm"}
                            _hover={{cursor: "pointer"}}
                            onClick={() => {
                                navigate("/chat")
                            }}
                        >
                            {
                                unReadMessages.length > 0 &&
                                <AvatarBadge boxSize='1.25em' bg='red.500' />
                            }
                        </Avatar>
                    )}
                    {!token && isAuthenticated && !isTokenUser && (
                        <Avatar
                            showBorder={true}
                            border={"0.5px solid gray"}
                            _hover={{cursor: "pointer"}}
                            onClick={() => navigate(`/mypage`)}
                            size={"sm"}
                            src={
                                profileImage
                                    ? `http://image.storyb.kr/${profileImage.path}`
                                    : `/images/profile.png`
                            }
                        />
                    )}
                    {!token && isAuthenticated && !isTokenUser && (
                        <IconButton
                            aria-label={"logout"}
                            bgColor={"white"}
                            onClick={() => {
                                logout();
                                showToast(
                                    "logout.successTitle",
                                    "logout.successDescription",
                                    "success"
                                );
                            }}
                        >
                            <IoIosLogOut fontSize={"24px"}/>
                        </IconButton>
                    )}
                    {token && type=="NORMAL" && (
                        <Text
                            marginLeft={3}
                            fontSize={isMobile ? "xs" : "md"}
                            lineHeight={appBarHeight}
                            fontWeight="400"
                            cursor="pointer"
                            onClick={() => {
                                const url = `/signup`;
                                const searchParams = new URLSearchParams();

                                if (token) {
                                    searchParams.append("token", token);
                                }

                                navigate(`${url}?${searchParams.toString()}`, {
                                    replace: true,
                                });
                            }}
                        >
                            {"회원가입"}
                        </Text>
                    )}
                </Flex>
            </HStack>
        </Flex>
    );
};

export default LoginAppBar;
