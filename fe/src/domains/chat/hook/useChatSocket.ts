import {useEffect, useState} from "react";
import {ChatMessageType, ChatRoomType} from "./useChatList";
import {SocketStore} from "../store/WebSocketStore";
import {useAuthStore} from "../../../common/stores/AuthStore";
import {StompSubscription} from "@stomp/stompjs";
import {retrieveChatMessages} from "../api/ChatAPI";

export interface UseChatSocketReturn {
    currentMessages : ChatMessageType[] | [],
    changeCurrentChatRoom : (chatRoom:ChatRoomType) => void,
    handleWriteChat : (chat:string) => void
}

const useChatSocket = (currentRoom:ChatRoomType) => {
    const {stompClient} = SocketStore();
    const {memberId: myId} = useAuthStore();

    const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoomType>(currentRoom);
    const [currentMessages, setCurrentMessages] = useState<ChatMessageType[]>([]);

    // const [sub, setSub] = useState<StompSubscription | null>(null);

    // useEffect(() => {
    //     if(currentChatRoom){
    //         if(sub){
    //             sub.unsubscribe();
    //         }
    //
    //         fetchRecentMessage();
    //         connectRoom();
    //     }
    // }, [currentChatRoom]);
    //
    // useEffect(() => {
    //     return () => {
    //         if(sub){
    //             sub.unsubscribe();
    //         }
    //     }
    // }, []);

    useEffect(() => {
        if (stompClient) {
            if (currentChatRoom) {
                const subscription = stompClient.subscribe(`/sub/chatroom/${currentChatRoom.id}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setCurrentMessages(prevState => [...prevState, newMessage])
                });
                fetchRecentMessage();

                return () => subscription.unsubscribe();
            }
        }
    }, [currentChatRoom]);
    //
    // useEffect( () => {
    //     if (stompClient) {
    //         if (currentChatRoom) {
    //             const subscription = stompClient.subscribe(`/sub/chatroom/${currentChatRoom.id}`, (message) => {
    //                 const newMessage = JSON.parse(message.body);
    //                 setCurrentMessages(prevState => [...prevState, newMessage])
    //             });
    //             fetchRecentMessage();
    //
    //             return () => subscription.unsubscribe();
    //         }
    //     }
    // }, [])

    const fetchRecentMessage = async () => {
        const currentMessages = await retrieveChatMessages(currentChatRoom.id);
        setCurrentMessages(currentMessages);
    }

    // const connectRoom = () => {
    //     if (stompClient) {
    //         if (currentChatRoom) {
    //             const subscription = stompClient.subscribe(`/sub/chatroom/${currentChatRoom.id}`, (message) => {
    //                 const newMessage = JSON.parse(message.body);
    //                 setCurrentMessages(prevState => [...prevState, newMessage])
    //             });
    //
    //             setSub(subscription);
    //         } else {
    //             if(sub){
    //                 sub.unsubscribe();
    //                 setSub(null);
    //             }
    //         }
    //     }
    // }

    const handleWriteChat = async (chat: string) => {
        if (stompClient) {
            const body = {
                senderId: myId,
                roomId: currentChatRoom?.id,
                message: chat,
                chatType: "TEXT",
            };
            stompClient.send(`/pub/message`, {}, JSON.stringify(body));
        }
    }

    return {
        currentMessages,
        changeCurrentChatRoom:setCurrentChatRoom,
        handleWriteChat
    }
}

export default useChatSocket;