import axiosInstance from "../../../common/api/axiosInstance";
import {
  CreateCommentAPI,
  DeleteCommentsAPI,
  FetchCommentsAPI,
  ModifyCommentsAPI,
  TagCommentAPI
} from "../../../common/api/ApiType";

interface POI {
  id: number | null;
  title: string;
  content: string;
  images: number[];
  index: number;
  createdAt?: string;
}

interface POSTPOI {
  title: string;
  content: string;
  imageIds: number[];
}

export const getTitles = async (
  nickname: string,
  page: number,
  size: number,
  token?: string
) => {
  const params: Record<string, any> = {
    size: size,
    page: page,
  };

  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.get(`/members/${nickname}/poies`, {
    params,
  });
  console.log("getTitles_response:", response.data);
  return response.data;
};

export const getPOI = async (
  poiId: number,
  token?: string
) => {
  const params: Record<string, any> = {};
  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.get(
    `/poies/${poiId}`,
    { params }
  );
  return response.data;
};

export const createPOI = async (poiData: POSTPOI) => {
  const response = await axiosInstance.post(
    `/poies`,
    poiData
  );
  return response.data;
};

export const updatePOI = async (poiId: number, poiData: POI) => {
  const response = await axiosInstance.put(`/poies/${poiId}`, {
    id: poiData.id,
    title: poiData.title,
    content: poiData.content,
    index: poiData.index,
    imageIds: poiData.images,
    createdAt: poiData.createdAt,
    updatedAt: null,
  });
  return response.data;
};

export const deletePOI = async (poiId: number) => {
  const response = await axiosInstance.delete(`/poies/${poiId}`);
  return response.data;
};

export const updatePOIIndexes = async (
  id: number,
  index:number
) => {
  const response = await axiosInstance.put(`/poies/${id}/index`, {
    index: index
  });
  return response.data;
};

export const createPOIComment : CreateCommentAPI = async (
  poiId: number,
  content: string,
  nickname?: string,
  imageIds?:number[],
  token?: string|null
) => {
  const params: Record<string, any> = {};
  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.post(
    `/poies/${poiId}/comment`,
    {
      nickName: nickname,
      content: content,
      imageIds: imageIds
    },
    { params }
  );
  return response.data;
};

export const getPOIComments :FetchCommentsAPI = async (
  poiId: number,
  page: number,
  size: number,
  token?: string|null
) => {
  const params: Record<string, any> = {
    page: page,
    size: size,
  };

  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.get(`/poies/${poiId}/comments`, {
    params,
  });
  return response.data.data.comments.content;
};

export const deleteComment: DeleteCommentsAPI = async (commentId: number, token?:string|null) => {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data;
};

export const updateComment : ModifyCommentsAPI = async (
  commentId: number,
  editText: string,
  imageIds?:number[],
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
        imageIds:imageIds
      },
      {
        params: {
          token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update comment:", error);
    throw error;
  }
};

export const linkPOICommentTag : TagCommentAPI = async (
  poiId: number,
  commentId: number,
  startIndex: number,
  lastIndex: number,
) => {
  const params: Record<string, any> = {};
  // if (token && token.trim() !== "") {
  //   params.token = token;
  // }

  const response = await axiosInstance.post(
    `/poies/${poiId}/comments/${commentId}/tag-link`,
    {
      startIndex: startIndex,
      lastIndex: lastIndex,
    },
    { params }
  );

  return response.data;
};
