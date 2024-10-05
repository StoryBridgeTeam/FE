import React, {MouseEventHandler, useEffect, useState} from "react";
import {Avatar, Badge, Box, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import {ImageRes} from "../../../common/hooks/useImage";
import {ChatMessageType, UseChatReturn} from "../hook/useChatList";
import {ChatAlarmStore} from "../store/GlobalChatStore";

const ChatRoomList = ({useChatHook}: { useChatHook: UseChatReturn }) => {
    const {unReadMessages} = ChatAlarmStore();
    const [roomMsgMap, setRoomMsgMap] = useState<any>({});

    useEffect(() => {
        mapRoomIdToUnReadMsg();
    }, [unReadMessages]);

    const mapRoomIdToUnReadMsg = () => {
        const roomIdMsgMap:any = {};
        for (const msg of unReadMessages){
            if(roomIdMsgMap.hasOwnProperty(msg.roomId)){
                roomIdMsgMap[msg.roomId] = [...roomIdMsgMap[msg.roomId], msg]
            }else{
                roomIdMsgMap[msg.roomId] = [msg]
            }
        }

        setRoomMsgMap(roomIdMsgMap);
    }

    const countUnReadMsg = (roomId : number) => {
        if(roomMsgMap && roomMsgMap.hasOwnProperty(roomId)){
            return roomMsgMap[roomId].length;
        }else{
            return 0;
        }
    }

    return <Box w={"100%"} h={"100%"}>
        <Box h={"60px"}>
            <Heading p={3} size={"md"}>채팅</Heading>
        </Box>
        <VStack w={"100%"} h={"calc(100% - 60px)"} gap={2} px={1} overflowY={"auto"}>
            {
                useChatHook.chatRooms.map(r => (
                    <ChatRoomRow selected={r.id===useChatHook.currentChatRoom?.id} name={r.name} msg={r.lastMsg} unReadCount={countUnReadMsg(r.id)}  profile={r.profile}
                                 handleOnClick={e => useChatHook.handleSetCurrentChatRoom(r)}/>
                ))
            }
        </VStack>
    </Box>
}

const ChatRoomRow = ({name, msg, unReadCount, selected = false, profile, handleOnClick}: {
    name: string,
    msg: string,
    unReadCount : number,
    selected?: boolean,
    handleOnClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    profile?: ImageRes
}) => {
    return <HStack w={"100%"} gap={1} _hover={{cursor: "pointer", bgColor: "#e3e2e2"}} p={2} borderRadius={5}
                   bgColor={selected ? "#e2e2e2" : "none"}
                   onClick={handleOnClick}>
        {
            profile ?
                <Avatar size={"md"} src={`${process.env.REACT_APP_IMAGE_SERVER}/${profile.path}`}/> :
                <Avatar size={"md"} src={'images/profile.png'}/>
        }
        <VStack w={"100%"} gap={0} overflow={"hidden"} px={4}>
            <HStack w={"100%"}>
                <Text fontWeight={900} fontSize={18}>{name}</Text>
                {
                    unReadCount > 0 &&
                    <Badge colorScheme={"red"}>{unReadCount}</Badge>
                }
            </HStack>
            <Text w={"100%"} fontSize={15} isTruncated>{msg}</Text>
        </VStack>
    </HStack>
}

export default ChatRoomList;