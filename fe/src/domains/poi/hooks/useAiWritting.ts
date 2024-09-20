import {useDisclosure} from "@chakra-ui/react";
import {useState} from "react";
import {baseAiWrittingAPI, imageAiWrittingAPI, newsAiWrittingAPI, sentAiWrittingAPI} from "../api/aiWrittingAPI";

export interface UseAiWrittingReturn {
    isOpen : boolean,
    onClose : ()=>void,
    onOpen : ()=>void,
    loading:boolean,
    result : string,
    handleBaseWritting : (content:string) => void
    handleSentenceWritting : (sents:string[]) => void,
    handleNewsWritting : (url:string) => void,
    handleImageWritting:(imgUrl : string) => void
}

export const useAiWritting = ():UseAiWrittingReturn => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState<boolean>(false);
    const [returnContent, setReturnContent] = useState<string>("");
    const handleBaseWritting = async (content:string) => {
        setLoading(true);
        const result = await baseAiWrittingAPI(content);
        setReturnContent(result);
        setLoading(false);
    }

    const handleSentenceWritting = async (sents:string[]) => {
        setLoading(true);
        const result = await sentAiWrittingAPI(sents);
        setReturnContent(result);
        setLoading(false);
    }

    const handleNewsWritting = async (url:string) => {
        setLoading(true);
        const result = await newsAiWrittingAPI(url);
        setReturnContent(result);
        setLoading(false);
    }

    const handleImageWritting = async (imgUrl : string) => {
        setLoading(true);
        const result = await imageAiWrittingAPI(imgUrl);
        setReturnContent(result);
        setLoading(false);
    }

    return {
        isOpen,
        onClose,
        onOpen,
        loading,
        handleBaseWritting,
        handleSentenceWritting,
        handleNewsWritting,
        handleImageWritting,
        result:returnContent
    }
}

