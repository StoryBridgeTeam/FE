import axiosInstance, {chatServerAxiosInstance} from "../../../common/api/axiosInstance";
import {ChatMessageType} from "../hook/useChatList";

export interface ChatRoomResponse {
    roomId : number,
    memberIds : number[],
    messageReadStatus : string,
    lastMsg : string

}

export const retrieveUnReadMessages = async () : Promise<ChatMessageType[]> => {
    const response = await chatServerAxiosInstance.get("/unread-chats");

    return response.data.data;
}

export const retrieveChatMessages = async (roomId : number):Promise<ChatMessageType[]> => {
    const response = await chatServerAxiosInstance.get(`/chat/${roomId}/messages`)

    return response.data.data;
}

export const retrieveMemberInfo = async (memberInfo :number) => {
    const response = await axiosInstance.get(`/members/${memberInfo}`)
    return response.data.data;
}

export const retrieveChatRooms = async () : Promise<ChatRoomResponse[]> => {
   try {
     const response = await chatServerAxiosInstance.get("/chatRooms")
     return response.data.data;
   } catch (error) {
     console.error("Error fetching chat rooms:", error);
     return [];
   }
}

export const getChatRoom = async (memberIds:number[]) => {
    const response = await chatServerAxiosInstance.post("/chat/room",{
        memberIds : memberIds
    })

    return response.data.data;
}

export const uploadFile = async (file : FormData) => {
    try {
        const response = await axiosInstance.post(
            `/files`,
            file,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        throw error;
    }
}