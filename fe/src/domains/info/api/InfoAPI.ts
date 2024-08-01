import axiosInstance from "../../../common/api/axiosInstance";
import { getNicknameToken } from "../../login/api/nickname";
const nickname = getNicknameToken();

export const getCoverLetters = async (token?: string) => {
  try {
    const response = await axiosInstance.get(
      `/members/${nickname}/cover-letter`,
      {
        params: {
          token,
        },
      }
    );
    console.log(response.data);
    return response.data.data.entries;
  } catch (error) {
    console.error("Failed to fetch cover letters:", error);
    throw error;
  }
};

export const putCoverLetters = async (
  entries: { id: number | null; title: string; content: string }[]
) => {
  try {
    const response = await axiosInstance.put(
      `/members/${nickname}/cover-letter`, // nickname 변수를 정의하거나 필요한 값을 전달하세요
      {
        entries: entries.map(({ id, title, content }) => ({
          id: null, // ID가 없으면 null로 설정
          title,
          content,
          createdAt: null, // 서버에서 생성 날짜를 처리할 것이라 가정
          modifiedAt: null, // 서버에서 수정 날짜를 처리할 것이라 가정
        })),
      }
    );
    return response.data.data.entries;
  } catch (error) {
    console.error("Failed to update cover letters:", error);
    throw error;
  }
};
