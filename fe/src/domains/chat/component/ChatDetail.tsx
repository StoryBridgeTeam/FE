import {Avatar, Box, HStack, IconButton, Input, Text, VStack} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import {ImageRes} from "../../../common/hooks/useImage";
import {ChevronRightIcon} from "@chakra-ui/icons";
import {ChatRoomType, UseChatReturn} from "../hook/useChatList";
import InitialChatDetail from "./InitialChatDetail";
import {useAuthStore} from "../../../common/stores/AuthStore";
import useChatSocket, {UseChatSocketReturn} from "../hook/useChatSocket";
import UseChatSocket from "../hook/useChatSocket";
import {ChatAlarmStore} from "../store/GlobalChatStore";

const ChatDetail = ({currentChatRoom}:{currentChatRoom:ChatRoomType}) => {
    const {readMessage} = ChatAlarmStore();
    const {memberId : myId} = useAuthStore();
    const messageViewRef = useRef<HTMLDivElement>(null);
    const useChatSocketHook = useChatSocket(currentChatRoom);

    useEffect(() => {
        if(messageViewRef.current){
            messageViewRef.current.scrollTop = messageViewRef.current.scrollHeight;
        }

    }, [useChatSocketHook.currentMessages]);

    useEffect(() => {
        if(currentChatRoom){
            useChatSocketHook.changeCurrentChatRoom(currentChatRoom);
            readMessage(currentChatRoom.id);
        }
    }, [currentChatRoom]);

    return <Box h={"100%"}>
        <Box borderBottom={"0.5px solid #dbdbdb"} p={5} h={"80px"}>
            <DetailHeader name={currentChatRoom.name} lastMsgAt={""} profile={currentChatRoom?.profile} />
        </Box>
        <VStack p={5} gap={5} h={"calc(100% - 160px)"} overflow={"auto"} ref={messageViewRef}>
            {
                useChatSocketHook.currentMessages.map(m => {
                    if(m.senderId==myId){
                        return <RightChatDetailRow msg={m.message} msgAt={"9999"} />
                    }else{
                        return <LeftChatDetailRow name={currentChatRoom?.name} msg={m.message} profile={currentChatRoom.profile} msgAt={"2024-05-02"}/>
                    }
                })
            }
        </VStack>
        <Box h={"80px"} borderTop={"0.5px solid #dbdbdb"}>
            <ChatInput useChatSocketHook={useChatSocketHook}/>
        </Box>
    </Box>
}

const ChatInput = ({useChatSocketHook}:{useChatSocketHook:UseChatSocketReturn}) => {
    const [text, setText] = useState<string>("");

    const handleSubmitChat = (e : any) => {
        if(text!=null && text.length>0){
            useChatSocketHook.handleWriteChat(text);
            setText("");
        }
    }

    return <HStack justifyContent={"center"} alignItems={"center"} h={"100%"} p={5}>
        <Input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => {
            if(e.nativeEvent.isComposing) return;
            if(e.key == "Enter") handleSubmitChat(e);
        }} />
        <IconButton aria-label={"submit"} variant={"outline"} onClick={handleSubmitChat} >
            <ChevronRightIcon />
        </IconButton>
    </HStack>
}

const DetailHeader = ({name, lastMsgAt, profile}:{name:string, lastMsgAt:string, profile?:ImageRes}) => {
    return <HStack w={"100%"} gap={1}>
        {
            profile ?
                <Avatar size={"md"} src={`${process.env.REACT_APP_IMAGE_SERVER}/${profile.path}`}/> :
                <Avatar size={"md"} src={'images/profile.png'}/>
        }
        <VStack w={"100%"} gap={0} overflow={"hidden"} px={4}>
            <Text w={"100%"} fontWeight={600} fontSize={18}>{name}</Text>
            <Text w={"100%"} fontSize={15} isTruncated >{lastMsgAt}</Text>
        </VStack>
    </HStack>
}

const LeftChatDetailRow = ({name, msg, msgAt, profile}:{name?:string,msg:string, msgAt:string, profile?:ImageRes}) => {
    return <Box w={"100%"}>
        <HStack w={"40%"} gap={1} minW={"200px"}>
            {
                profile ?
                    <Avatar size={"md"} src={`${process.env.REACT_APP_IMAGE_SERVER}/${profile.path}`}/> :
                    <Avatar size={"md"} src={'images/profile.png'}/>
            }
            <VStack w={"100%"} gap={0} overflow={"hidden"} px={4} position={"relative"}>
                <Text w={"100%"} fontWeight={600} fontSize={18}>{name}</Text>
                <Text w={"100%"} bgColor={"#e2e2e2"} borderRadius={5} p={3}
                      _after={{
                          content : `' '`,
                          position : 'absolute',
                          left:0,
                          top:"50%",
                          width:0, height:0, border:"10px solid transparent",
                          borderRightColor:"#e2e2e2",
                      }}
                      fontSize={15}>
                    {msg}</Text>
            </VStack>
        </HStack>
    </Box>
}

const RightChatDetailRow = ({msg, msgAt}:{msg:string, msgAt:string}) => {
    return <HStack w={"100%"} justifyContent={"end"}>
        <HStack w={"40%"} gap={1} minW={"200px"}>
            <VStack w={"100%"} gap={0} overflow={"hidden"} px={4} position={"relative"}>
                <Text w={"100%"} bgColor={"#1c1c1c"} borderRadius={5} p={3} color={"white"} fontWeight={600}
                      _after={{
                          content : `' '`,
                          position : 'absolute',
                          right:0,
                          width:0, height:0, border:"10px solid transparent",
                          borderLeftColor:"#1c1c1c",
                      }}
                      fontSize={15}>
                    {msg}</Text>
            </VStack>
        </HStack>
    </HStack>
}

export default ChatDetail;
