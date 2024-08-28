import axiosInstance from "../../../common/api/axiosInstance";

interface POI {
  id: number | null;
  title: string;
  content: string;
  images: number[];
  index: number;
  createdAt?: string;
}

interface POSTPOI {
  id: number | null;
  title: string;
  content: string;
  imageIds: number[];
  index: number;
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
  nickname: string,
  poiId: number,
  token?: string
) => {
  const params: Record<string, any> = {};
  if (token && token.trim() !== "") {
    params.token = token;
  }

  const response = await axiosInstance.get(
    `/members/${nickname}/poies/${poiId}`,
    { params }
  );
  return response.data;
};

export const createPOI = async (nickname: string, poiData: POSTPOI) => {
  console.log("createPOI_poiData:", poiData);
  const response = await axiosInstance.post(
    `members/${nickname}/poies`,
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
  nickname: string,
  modifyList: { id: number; index: number }[]
) => {
  const response = await axiosInstance.put(`/members/${nickname}/poies/index`, {
    modifyList,
  });
  return response.data;
};

export const createPOIComment = async (
  poiId: number,
  nickname: string,
  content: string,
  token?: string
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
    },
    { params }
  );
  return response.data;
};

export const getPOIComments = async (
  poiId: number,
  page: number,
  size: number,
  token?: string
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
  return response.data;
};

export const deleteComment = async (commentId: number) => {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data;
};

export const updateComment = async (
  commentId: number,
  editText: string,
  token?: string
) => {
  try {
    const nickName = localStorage.getItem("nickName");
    const response = await axiosInstance.put(
      `/comments/${commentId}`,
      {
        nickName,
        commentId,
        content: editText,
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

export const linkPOICommentTag = async (
  poiId: number,
  commentId: number,
  startIndex: number,
  lastIndex: number,
  token?: string
) => {
  const params: Record<string, any> = {};
  if (token && token.trim() !== "") {
    params.token = token;
  }

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
