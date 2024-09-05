import axiosInstance from "../../../common/api/axiosInstance";

export const userBlock = async (nickname:string)=> {
  try {
    const response = await axiosInstance.post(
        `/members/block?nickname=${nickname}`
    );
  } catch (error) {
    console.error(error);
  }
}

export const userUnBlock = async (nickname:string)=> {
  try {
    const response = await axiosInstance.delete(
        `/members/block?nickname=${nickname}`
    );
  } catch (error) {
    console.error(error);
  }
}

export const amtBlock = async (nickname: string) => {
  try {
    const response = await axiosInstance.post(
      `/members/amt/block?nickname=${nickname}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const amtBlockReset = async (nickname: string) => {
  try {
    const response = await axiosInstance.delete(
      `/members/amt/block?nickname=${nickname}`
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAmt = async (nickname: string, token?: string) => {
  try {
    const response = await axiosInstance.get(`/members/${nickname}/amt`, {
      params: {
        token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getAmtChild = async (
  nickname: string,
  page: number,
  token?: string
) => {
  try {
    const response = await axiosInstance.get(`/members/${nickname}/children`, {
      params: {
        token,
        page,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getNetwork = async (
  nickname: string,
  token?: string
) => {
  try {
    const response = await axiosInstance.get(`/members/${nickname}/activity`, {
      params: {
        token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

