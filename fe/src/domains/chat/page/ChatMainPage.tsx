import {Box, Container, Flex, Grid, Spinner, useBreakpointValue} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import LoginAppBar from "../../../common/components/LoginAppBar";
import ChatRoomList from "../component/ChatRoomList";
import ChatDetail from "../component/ChatDetail";
import InitialChatDetail from "../component/InitialChatDetail";
import {useLocation} from "react-router-dom";
import useChatList, {UseChatReturn} from "../hook/useChatList";
import {use} from "i18next";

const ChatPage = () => {
    const isMobile = useBreakpointValue({base: true, md: false});
    const location = useLocation();
    const {targetId: chatTargetMemberId} = location.state ? location.state : {targetId : null};

    const useChatHook = useChatList();

    useEffect(() => {
        if(chatTargetMemberId){
            useChatHook.handleSetCurrentChatRoomByMemberIds([chatTargetMemberId])
        }
    }, []);

    return <Flex h="100vh" direction="column" w={"100%"}>
        <LoginAppBar isShowSearch={true}/>
        <Container
            w={"100%"}
            maxW={"1400px"}
            h={"calc(100vh - 60px)"}
            mt={isMobile ? "50px" : "60px"}
            px={0}
        >
            {
                useChatHook.loading ?
                    <Spinner /> :
                isMobile ?
                    <MobileView useChatHook={useChatHook}/> :
                    <DesktopView useChatHook={useChatHook}/>
            }
        </Container>
    </Flex>
}

const DesktopView = ({useChatHook}:{useChatHook:UseChatReturn}) => {
    return <Flex h={"100%"}>
        <Box h={"100%"} w={"350px"} borderRight={"0.5px solid #dbdbdb"}>
            <ChatRoomList useChatHook={useChatHook}/>
        </Box>
        <Box w={"100%"}>
            {
                useChatHook.currentChatRoom ?
                    <ChatDetail currentChatRoom={useChatHook.currentChatRoom}/> :
                    <InitialChatDetail/>
            }
        </Box>
    </Flex>;
}

const MobileView = ({useChatHook}:{useChatHook:UseChatReturn}) => {
    return <Flex h={"100%"}>
        {
            useChatHook.currentChatRoom ?
                <Box w={"100%"}>
                    <ChatDetail currentChatRoom={useChatHook.currentChatRoom}/>
                </Box>
                :
                <Box h={"100%"} w={"100%"} borderRight={"0.5px solid #dbdbdb"}>
                    <ChatRoomList useChatHook={useChatHook}/>
                </Box>
        }
    </Flex>;
}

export default ChatPage;
