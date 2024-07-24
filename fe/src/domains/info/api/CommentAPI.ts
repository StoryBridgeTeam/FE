import axiosInstance from "../../../common/api/axiosInstance";

export const getComments = async (coverLetterId: number) => {
  try {
    const response = await axiosInstance.get(
      `/cover-letter/${coverLetterId}/comments`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export const postComment = async (
  coverLetterId: number,
  token: string,
  comment: { nickName: string; content: string }
) => {
  try {
    const response = await axiosInstance.post(
      `/cover-letter/${coverLetterId}/comments?token=${token}`,
      comment
    );
    return response.data;
  } catch (error) {
    console.error("Failed to post comment:", error);
    throw error;
  }
};

export const updateComment = async (
  coverLetterId: number,
  commentId: number,
  token: string,
  updatedComment: { nickName: string; content: string }
) => {
  try {
    const response = await axiosInstance.put(
      `/cover-letter/${coverLetterId}/comments/${commentId}/normal?token=${token}`,
      {
        nickName: updatedComment.nickName,
        commentId,
        content: updatedComment.content,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update comment:", error);
    throw error;
  }
};

export const deleteComment = async (
  commentId: number,
  coverLetterId: number
) => {
  try {
    const response = await axiosInstance.delete(
      `/cover-letter/${coverLetterId}/comments/${commentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
};

export const tagComment = async (
  coverLetterId: number,
  commentId: number,
  tagDetails: { startIndex: number; lastIndex: number }
) => {
  try {
    const response = await axiosInstance.post(
      `/cover-letter/${coverLetterId}/comments/${commentId}/tag-link`,
      tagDetails
    );
    return response.data;
  } catch (error) {
    console.error("Failed to tag comment:", error);
    throw error;
  }
};
