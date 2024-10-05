import {useEffect, useState} from "react";
import {ChatMessageType, ChatRoomType} from "./useChatList";
import {SocketStore} from "../store/WebSocketStore";
import {useAuthStore} from "../../../common/stores/AuthStore";
import {StompSubscription} from "@stomp/stompjs";
import {retrieveChatMessages, uploadFile} from "../api/ChatAPI";
import {uploadImage} from "../../../common/api/imageAPI";

export interface UseChatSocketReturn {
    currentMessages : ChatMessageType[] | [],
    changeCurrentChatRoom : (chatRoom:ChatRoomType) => void,
    handleWriteChat : (chat:string) => void,
    handleTransmitFile : () => void
}

const useChatSocket = (currentRoom:ChatRoomType) => {
    const {stompClient} = SocketStore();
    const {memberId: myId} = useAuthStore();

    const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoomType>(currentRoom);
    const [currentMessages, setCurrentMessages] = useState<ChatMessageType[]>([]);

    useEffect(() => {
        if (stompClient) {
            if (currentChatRoom) {
                const subscription = stompClient.subscribe(`/sub/chatroom/${currentChatRoom.id}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setCurrentMessages(prevState => [...prevState, newMessage])
                });
                fetchRecentMessage();

                return () => subscription.unsubscribe({"dest":`/sub/chatroom/${currentChatRoom.id}`});
            }
        }
    }, [currentChatRoom]);

    const fetchRecentMessage = async () => {
        const currentMessages = await retrieveChatMessages(currentChatRoom.id);
        setCurrentMessages(currentMessages);
    }
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
    };

    const handleTransmitFile = () => {
        if(stompClient){
            try {
                const input = document.createElement("input");
                input.type = "file";
                input.onchange = async (event: any) => {
                    const file = event.target.files[0];

                    // setLoading(true);
                    if (file) {
                        const formData = new FormData();
                        formData.append("file", file);

                        const resFile = await uploadFile(formData);
                        // setImages((prevImages) => [...prevImages, uploadedImage]);


                        const body = {
                            senderId: myId,
                            roomId: currentChatRoom?.id,
                            message: JSON.stringify(resFile),
                            chatType: "FILE",
                        };
                        stompClient.send(`/pub/message`, {}, JSON.stringify(body));
                    }

                    // setLoading(false);
                };

                input.click();
            } catch (error) {
                console.error("Image upload failed:", error);
            }
        }
    }

    return {
        currentMessages,
        changeCurrentChatRoom:setCurrentChatRoom,
        handleWriteChat,
        handleTransmitFile
    }
}

export default useChatSocket;