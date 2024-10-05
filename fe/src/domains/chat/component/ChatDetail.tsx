import {
    Avatar,
    Box, Heading,
    HStack,
    IconButton,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text, useBreakpointValue,
    VStack
} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import {ImageRes} from "../../../common/hooks/useImage";
import {AddIcon, ChevronRightIcon, LinkIcon} from "@chakra-ui/icons";
import {ChatRoomType, UseChatReturn} from "../hook/useChatList";
import InitialChatDetail from "./InitialChatDetail";
import {useAuthStore} from "../../../common/stores/AuthStore";
import useChatSocket, {UseChatSocketReturn} from "../hook/useChatSocket";
import UseChatSocket from "../hook/useChatSocket";
import {ChatAlarmStore} from "../store/GlobalChatStore";
import { FaFile } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";


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
                        return <RightChatDetailRow msg={m.message} msgAt={"9999"} type={m.chatType}/>
                    }else{
                        return <LeftChatDetailRow name={currentChatRoom?.name} msg={m.message} profile={currentChatRoom.profile} msgAt={"2024-05-02"} type={m.chatType}/>
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
        <Menu>
            <MenuButton
            >
                <IconButton aria-label={"file add"} variant={"outline"}>
                    <AddIcon fontSize={"10px"}/>
                </IconButton>
            </MenuButton>
            <MenuList>
                <MenuItem icon={<LinkIcon fontSize={12}/>}
                          onClick={useChatSocketHook.handleTransmitFile}
                          fontSize={12}
                >
                    파일 전송
                </MenuItem>
            </MenuList>
        </Menu>
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

const LeftChatDetailRow = ({name, msg, msgAt,type, profile}:{name?:string,msg:string, msgAt:string,type:string, profile?:ImageRes}) => {
    const isMobile = useBreakpointValue({base: true, md: false});
    const bgColor = type==="FILE" ? "#305cde" : "#e2e2e2";
    const color = type==="FILE" ? "white" : "black";

    return <Box w={"100%"}>
        <HStack w={"45%"} gap={1} minW={"200px"} boxSizing={"border-box"}>
            <VStack w={"100%"} minW={"200px"} gap={1} px={4} position={"relative"} boxSizing={"border-box"}>
                <HStack w={"100%"}>
                    {
                        profile ?
                            <Avatar size={"xs"} src={`${process.env.REACT_APP_IMAGE_SERVER}/${profile.path}`}/> :
                            <Avatar size={"xs"} src={'images/profile.png'}/>
                    }
                    <Text w={"100%"} fontWeight={600} fontSize={18}>{name}</Text>
                </HStack>
                <Box
                    w={"100%"} bgColor={bgColor} borderRadius={5} p={3} color={color}
                      _after={{
                          content : `' '`,
                          position : 'absolute',
                          left:0,
                          top:"50%",
                          width:0, height:0, border:"10px solid transparent",
                          borderRightColor: `${bgColor}`,
                      }}
                >
                    {
                        type==="FILE" ?
                            <FileTypeMsg file={JSON.parse(msg)}/> :
                            msg
                    }
                </Box>
            </VStack>
        </HStack>
    </Box>
}

const RightChatDetailRow = ({msg, msgAt, type}:{msg:string, msgAt:string, type:string}) => {
    const bgColor = type==="FILE" ? "#305cde" : "#1c1c1c";

    return <HStack w={"100%"} justifyContent={"end"}>
        <HStack w={"45%"} gap={1} minW={"200px"}>
            <VStack w={"100%"} gap={0} px={4} position={"relative"}>
                <Text w={"100%"} bgColor={bgColor} borderRadius={5} p={3} color={"white"} fontWeight={600}
                      _after={{
                          content : `' '`,
                          position : 'absolute',
                          top:"50%",
                          right:0,
                          width:0, height:0, border:"10px solid transparent",
                          borderLeftColor:`${bgColor}`,
                      }}
                      fontSize={15}>
                    {
                        type==="FILE" ?
                            <FileTypeMsg file={JSON.parse(msg)}/> :
                            msg
                    }
                </Text>
            </VStack>
        </HStack>
    </HStack>
}

const processFileSize = (byteSize:number) => {
    if(byteSize==0) return 0;

    const KB = 1000;
    const MB = KB * 1000;
    const GB = MB * 1000;

    if(byteSize < MB){
        return `${byteSize / KB} KB`;
    }else if(MB < byteSize && byteSize < GB){
        return `${byteSize / MB} MB`;
    }else{
        return `${byteSize / GB} GB`;
    }
}

const FileTypeMsg = ({file}:{file:ImageRes}) => {
    const downloadFile = (url : string, name:string) => {
        const element = document.createElement('a');
        element.setAttribute('href', `${process.env.REACT_APP_IMAGE_SERVER}/${url}`);
        element.setAttribute('download', name);
        element.click();
    };

    return <HStack justifyContent={"space-between"} flexWrap={"wrap"}>
        <VStack wrap={"wrap"}>
            <HStack>
                <FaFile />
                <Heading fontSize={"0.9em"} whiteSpace={"wrap"} w={"100%"}>
                    {file.name}
                </Heading>
            </HStack>
            <HStack w={"100%"}>
                <Heading fontSize={"0.7em"}>
                    용량 : {processFileSize(file.size)}
                </Heading>
            </HStack>
        </VStack>
        <Box>
                <IconButton onClick={() => downloadFile(file.path, file.name)}
                            aria-label={"download"} size={"sm"} bgColor={"transparent"} border={"1px solid white"} isRound>
                    <FiDownload size={"18px"} color={"white"}/>
                </IconButton>
        </Box>
    </HStack>
};

export default ChatDetail;
