import {create} from "zustand";
import {CompatClient} from "@stomp/stompjs/esm6/compatibility/compat-client";

interface SocketState {
    stompClient : CompatClient | undefined,
    setStompClient : (stompClient : CompatClient) => void,
    loading : boolean,
    setLoading : (l : boolean) => void
}

export const SocketStore = create<SocketState>((set) => ({
    stompClient: undefined,
    loading : false,
    setLoading : (l:boolean) => {set({loading:l})},
    setStompClient: (stompClient : CompatClient) => {
        set((prev) => ({ stompClient: stompClient }));
    },
}));
