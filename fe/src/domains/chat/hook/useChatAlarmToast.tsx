import {Avatar, Badge, Box, HStack, Text, useToast, VStack} from "@chakra-ui/react";
import {ChatMessageType} from "./useChatList";
import React from "react";
import {retrieveMemberInfo} from "../api/ChatAPI";

export interface UserChatAlarmToast{
    alarmChat : (chat:ChatMessageType) => void
}

export const useChatAlarmToast = () => {
    const toast = useToast();

    const alarmChat = async (chat : ChatMessageType) => {
        const senderInfo = await retrieveMemberInfo(chat.senderId)

        toast.closeAll();
        toast({
            title: "chat",
            position:"top-right",
            description: chat.message,
            status:"success",
            duration: 1500,
            isClosable: true,
            render: ()=>(
                <HStack bgColor={"white"}  zIndex={99999} border={"0.5px solid gray"} p={2} borderRadius={5}>
                    {
                        senderInfo.profileImage ?
                            <Avatar size={"md"} src={`${process.env.REACT_APP_IMAGE_SERVER}/${senderInfo.profileImage.path}`}/> :
                            <Avatar size={"md"} src={'images/profile.png'}/>
                    }
                    <VStack w={"100%"} gap={0} overflow={"hidden"} px={4}>
                        <HStack w={"100%"}>
                            <Text fontWeight={900} fontSize={18}>{senderInfo.name}</Text>
                        </HStack>
                        <Text w={"100%"} fontSize={15} isTruncated>
                            {
                                chat.chatType=="FILE" ?
                                    "파일" :
                                    chat.message
                            }
                        </Text>
                    </VStack>
                </HStack>
        )
    });
    }

    return{
        alarmChat
    }
}