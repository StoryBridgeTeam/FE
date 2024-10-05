import {useEffect, useState} from "react";
import {ChatRoomResponse, getChatRoom, retrieveChatRooms, retrieveMemberInfo} from "../api/ChatAPI";
import {ImageRes} from "../../../common/hooks/useImage";
import {useAuthStore} from "../../../common/stores/AuthStore";
import {SocketStore} from "../store/WebSocketStore";

export interface ChatRoomType {
    id: number,
    lastMsg: string,
    name: string,
    profile?: ImageRes | undefined
}

export interface ChatMessageType {
    roomId : number,
    messageId:number,
    senderId: number,
    receiverIds: number[],
    message: string,
    createdAt:string,
    chatType: string
}

export interface UseChatReturn {
    chatRooms: ChatRoomType[] | [],
    currentChatRoom: ChatRoomType | undefined,
    loading:boolean,
    handleSetCurrentChatRoomByMemberIds: (memberIds: number[]) => void,
    handleSetCurrentChatRoom: (chatRoom: ChatRoomType) => void,
}

const useChatList = () => {
    const {memberId: myId} = useAuthStore();
    const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
    const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoomType>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchChatRooms();
    }, []);

    const processChatRoomData = async (chatRoomResponses: ChatRoomResponse[]) => {
        let result: ChatRoomType[] = []
        for (const curChatRoom of chatRoomResponses) {
            if (curChatRoom.memberIds.length == 2) {
                const otherMemberId = curChatRoom.memberIds.filter(id => myId != id)[0]

                const otherInfo = await retrieveMemberInfo(otherMemberId)

                const curResult = {
                    id: curChatRoom.roomId,
                    lastMsg: curChatRoom.lastMsg,
                    name: otherInfo.name,
                    profile: otherInfo.profileImage
                }

                result = [...result, curResult]
            }
        }

        return result
    }

    const fetchChatRooms = async () => {
        const rooms = await retrieveChatRooms();
        const proccessedChatRooms = await processChatRoomData(rooms);
        setChatRooms(proccessedChatRooms);
    }

    const handleSetCurrentChatRoomByMemberIds = async (memberIds: number[]) => {
        if (myId && memberIds.length == 1) {
            setLoading(true);
            const otherMemberId = memberIds.filter(id => myId != id)[0]
            const chatRoom = await getChatRoom([myId, ...memberIds])
            const otherInfo = await retrieveMemberInfo(otherMemberId)

            setCurrentChatRoom({
                id: chatRoom.roomId,
                lastMsg: chatRoom.lastMsg,
                name: otherInfo.name,
                profile: otherInfo.profileImage
            });
            fetchChatRooms();
            setLoading(false);
        }
    }

    const handleSetCurrentChatRoom = (chatRoom: ChatRoomType) => {
        if(currentChatRoom && currentChatRoom.id==chatRoom.id){
            return;
        }else{
            setCurrentChatRoom(chatRoom);
        }
    }

    return {
        chatRooms,
        currentChatRoom,
        loading,
        handleSetCurrentChatRoomByMemberIds,
        handleSetCurrentChatRoom,
    }
}

export default useChatList;