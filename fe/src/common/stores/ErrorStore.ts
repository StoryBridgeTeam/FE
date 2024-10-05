import {create} from "zustand";
import {set} from "date-fns";

interface ErrorState {
    hasError: boolean;
    title : string,
    content: string,
    setError : (title:string, content:string) => void
    consumeError : () => void
}
export const useErrorStore = create<ErrorState>(set => ({
    hasError : false,
    title : "",
    content : "",
    setError : (title:string, content:string)=>{set({hasError:true, title:title, content:content})},
    consumeError : () => {set({hasError:false, title:"", content:""})}
}))