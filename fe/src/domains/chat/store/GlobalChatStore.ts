import create from "zustand";
import {ChatMessageType} from "../hook/useChatList";
import {set} from "date-fns";

interface ChatAlarmState{
    unReadMessages : ChatMessageType[] | [],
    unAlarmMessage : ChatMessageType | null,
    addMessage : (msg : ChatMessageType) => void,
    addBulkMessage : (msg : ChatMessageType[]) => void,
    consumeAlarmMsg : () => void,
    readMessage : (roomId : number) => void
}


export const ChatAlarmStore = create<ChatAlarmState>((set) => ({
    unReadMessages : [],
    unAlarmMessage : null,
    addMessage : (msg:ChatMessageType) => {set(prev => ({unReadMessages:[...prev.unReadMessages, msg], unAlarmMessage:msg}))},
    addBulkMessage : (msg:ChatMessageType[]) => {set(prev => ({unReadMessages:[...prev.unReadMessages, ...msg], unAlarmMessage:msg.sort().reverse()[0]}))},
    consumeAlarmMsg : () => { set(prev => ({unAlarmMessage:null}))},
    readMessage : (roomId:number) => {set(prev => {
        const newMessages = prev.unReadMessages.filter(msg => msg.roomId!=roomId)
        return {
            unReadMessages : newMessages
        }
    })}
}));