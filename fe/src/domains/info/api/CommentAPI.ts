import axiosInstance from "../../../common/api/axiosInstance";
import { getNicknameToken } from "../../login/api/nickname";

export const getComments = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/cover-letter/${id}/comments`);
    return response.data.data.comments;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const postComment = async (
  id: number,
  comment: { nickName: string; content: string },
  token?: string
) => {
  try {
    const response = await axiosInstance.post(
      `/cover-letter/${id}/comments`,
      comment
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to post comment:", error);
    throw error;
  }
};

export const updateComment = async (
  commentId: number,
  editText: string,
  token?: string
) => {
  try {
    const response = await axiosInstance.put(`/comments/${commentId}`, {
      nickName: getNicknameToken(),
      commentId,
      content: editText,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update comment:", error);
    throw error;
  }
};

export const deleteCommentServer = async (commentId: number) => {
  try {
    const response = await axiosInstance.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
};

export const tagComment = async (
  id: number,
  commentId: number,
  tagDetails: { startIndex: number; lastIndex: number }
) => {
  try {
    const response = await axiosInstance.post(
      `/cover-letter/${id}/comments/${commentId}/tag-link`,
      tagDetails
    );
    return response.data;
  } catch (error) {
    console.error("Failed to tag comment:", error);
    throw error;
  }
};
