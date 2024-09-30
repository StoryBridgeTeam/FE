import {create} from "zustand";
import {CompatClient} from "@stomp/stompjs/esm6/compatibility/compat-client";

interface SocketState {
    stompClient : CompatClient | undefined,
    setStompClient : (stompClient : CompatClient) => void
}

export const SocketStore = create<SocketState>((set) => ({
    stompClient: undefined,
    setStompClient: (stompClient : CompatClient) => {
        set((prev) => ({ stompClient: stompClient }));
    },
}));
