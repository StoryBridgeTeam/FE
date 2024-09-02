import {tagComment} from "../../domains/info/api/CommentAPI";
import {Comment} from "../hooks/useComment";

export interface FetchCommentsAPI {
    (targetId : number, page : number, size : number, toke?: string|null) : Promise<Comment[]>
}

export interface ModifyCommentsAPI {
    (commentId: number, text: string, imageIds?:number[], token?: string|null) : void
}

export interface DeleteCommentsAPI {
    (commentId: number, token?: string|null) : void
}

export interface TagCommentAPI {
    (targetId: number, commentId : number, startIndex : number, lastIndex : number) : void
}

export interface CreateCommentAPI{
    (targetId:number, content:string, nickname?:string, imageIds?:number[], token?:string|null) : void
}
