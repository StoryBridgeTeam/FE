import {Box, useDisclosure} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {ImageRes, useImage, useImageResponse} from "./useImage";
import {UseDisclosureReturn} from "@chakra-ui/hooks/dist/use-disclosure";
import commentItem from "../components/comment/CommentItem";
import {deleteCommentServer, tagComment, updateComment} from "../../domains/info/api/CommentAPI";
import {useToastMessage} from "./useToastMessage";
import {useTranslation} from "react-i18next";
import {HighlightedText} from "../../domains/info/hook/useTextSelection";
import {
    CreateCommentAPI,
    DeleteCommentsAPI,
    FetchCommentsAPI,
    ModifyCommentsAPI,
    TagCommentAPI
} from "../api/ApiType";
import {m} from "framer-motion";
import axios, {AxiosError} from "axios";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export interface Comment {
    id: number;
    author: Author;
    content: string;
    createdTime: string;
    modifiedTime: string | null;
    tagInfo: TagInfo | null;
    images: ImageRes[] | []
}

interface Author {
    name: string;
    nickName: string;
    role: string;
    profileImage: ImageRes;
}

interface TagInfo {
    startIndex: number;
    lastIndex: number;
}

export interface UseCommentProps {
    targetId : number,
    fetchCommentAPI: FetchCommentsAPI,
    editCommentAPI: ModifyCommentsAPI,
    deleteCommentAPI: DeleteCommentsAPI,
    createCommentAPI : CreateCommentAPI,
    tagCommentAPI?: TagCommentAPI,
    token?:string|null
}

export interface UseCommentReturn {
    comments: Comment[]|[],
    selectedComment: Comment | null,
    clearSelectedComment : () => void,
    handleOnClickConnect: (comment: any, modalOpen:()=>void) => void,
    handleConnectReset: (modalClose:()=>void, showToast:()=>void) => void,
    handleConnectSave: (selectedText: HighlightedText | null, modalClose:()=>void, showToast:()=>void) => void
    handleOnClickEdit: (comment: any, modalOpen:()=>void) => void,
    handleEditSave: (editText: string, modalClose:()=>void, showToast:()=>void, imageIds?:number[]) => void,
    handleDeleteSave: (comment: any, showToast:()=>void) => void,
    handleCreateComment : (content:string, showToast:()=>void, nickname?:string, imageIds?:number[])=>void,
    loading:boolean
}

const useComment = ({
                        targetId,
                        fetchCommentAPI,
                        editCommentAPI,
                        deleteCommentAPI,
                        tagCommentAPI,
                        createCommentAPI,
                        token
                    }: UseCommentProps): UseCommentReturn => {
    const [comments, setComments] = useState<Comment[]|[]>([]);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const { showToast:showInnerToast } = useToastMessage();
    const { t } = useTranslation();

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        const comments : Comment[] = await fetchCommentAPI(targetId, 0, 20, token);
        setComments(comments);
    }

    const clearSelectedComment = () => {
        setSelectedComment(null);
    }

    const handleOnClickConnect = (comment: any, modalOpen:()=>void) => {
        setSelectedComment(comment);
        modalOpen();
    };

    const handleConnectReset = async (modalClose:()=>void, showToast:()=>void) => {
        setLoading(true);
        if(tagCommentAPI){
            if (selectedComment !== null) {
                await tagCommentAPI(targetId, selectedComment.id, 0, 0)
                setSelectedComment(null);
                fetchComments();
                modalClose();
                showToast();
            }
        }
        setLoading(false);
    };

    const handleConnectSave = async (selectedText: HighlightedText | null, modalClose:()=>void, showToast:()=>void) => {
        setLoading(true);
        if (tagCommentAPI){
            if (selectedComment !== null && selectedText) {
                await tagCommentAPI(targetId, selectedComment.id, selectedText.startIndex, selectedText.endIndex)
                setSelectedComment(null);
                fetchComments();
                modalClose();
                showToast();
            }
        }
        setLoading(false);
    };

    const handleOnClickEdit = (selectedComment: any, modalOpen:()=>void) => {
        setSelectedComment(selectedComment);
        modalOpen();
    };

    const handleEditSave = async (editText: string, modalClose:()=>void, showToast:()=>void, imageIds?:number[]) => {
        setLoading(true);
        if (selectedComment !== null) {
            await editCommentAPI(selectedComment.id, editText, imageIds, token);
            setSelectedComment(null);
            fetchComments();
            modalClose();
            showToast();
        }
        setLoading(false);
    };

    const handleDeleteSave = async (comment: Comment, showToast:()=>void) => {
        setLoading(true);
        await deleteCommentAPI(comment.id);
        fetchComments();
        showToast();
        setLoading(false);
    };

    const handleCreateComment = async (content:string, showToast:()=>void, nickname?:string, imageIds?:number[]) => {
        setLoading(true);
        try{
            await createCommentAPI(targetId, content, nickname, imageIds, token);
        }catch (error){
            if(axios.isAxiosError(error)){
                if(error.response?.data.code==2260300){
                    setLoading(false);
                    showInnerToast(t("comment.error.alreadyUsedToken"),t("comment.error.alreadyUsedTokenMsg"), "error");
                    return;
                }
            }
        }
        fetchComments();
        showToast();
        setLoading(false);
    };

    return {
        comments,
        selectedComment,
        clearSelectedComment,
        handleOnClickConnect,
        handleConnectReset,
        handleConnectSave,
        handleOnClickEdit,
        handleEditSave,
        handleDeleteSave,
        handleCreateComment,
        loading
    };
}

export default useComment;
