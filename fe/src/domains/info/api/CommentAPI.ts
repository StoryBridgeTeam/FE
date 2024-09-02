import axiosInstance from "../../../common/api/axiosInstance";
import {
  CreateCommentAPI,
  DeleteCommentsAPI,
  FetchCommentsAPI,
  ModifyCommentsAPI,
  TagCommentAPI
} from "../../../common/api/ApiType";

export const getComments : FetchCommentsAPI = async (id: number,page: number,size:number, token?: string|null) => {
  try {
    const response = await axiosInstance.get(
      `/cover-letter/${id}/comments?page=${page}`,
      {
        params: {
          token,
        },
      }
    );
    return response.data.data.comments.content;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const postComment : CreateCommentAPI = async (
  id: number,
  content: string,
  nickname?:string,
  imageIds?:number[],
  token?: string|null
) => {
  try {
    const response = await axiosInstance.post(
      `/cover-letter/${id}/comments`,
        {
          nickName:nickname,
          content:content,
          imageIds:imageIds
        },
      {
        params: {
          token,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to post comment:", error);
    throw error;
  }
};

export const updateComment : ModifyCommentsAPI = async (
  commentId: number,
  editText: string,
  imageIds?: number[],
  token?: string|null
) => {
  try {
    const nickName = localStorage.getItem("nickName");
    const response = await axiosInstance.put(
      `/comments/${commentId}`,
      {
        nickName,
        commentId,
        content: editText,
          imageIds: imageIds
      },
      {
        params: {
          token,
        },
      }
    );
    // return response.data;
  } catch (error) {
    console.error("Failed to update comment:", error);
    throw error;
  }
};

export const deleteCommentServer : DeleteCommentsAPI = async (
  commentId: number,
  token?: string|null
) => {
  try {
    const response = await axiosInstance.delete(`/comments/${commentId}`, {
      params: {
        token,
      },
    });
    // return response.data;
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
};

export const tagComment : TagCommentAPI = async (targetId, commentId, startIndex, lastIndex ) => {
  try {
    const response = await axiosInstance.post(
      `/cover-letter/${targetId}/comments/${commentId}/tag-link`,
        {
          startIndex: startIndex,
          lastIndex: lastIndex
        }
    );
    // return response.data;
  } catch (error) {
    console.error("Failed to tag comment:", error);
    throw error;
  }
};
