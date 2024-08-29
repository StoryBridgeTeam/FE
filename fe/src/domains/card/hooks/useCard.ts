import { useState } from "react";
import {
  getIsCreatedCard,
  createCardInfo,
  getOriginalCardInfo,
  updateOriginalCardInfo,
  getPublicCardInfo,
  updatePublicCardInfo,
  createCardComment,
  getCardComments,
} from "../api/cardAPI";
import { EntryState, FetchType } from "../types/cardTypes";
import axios from "axios";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

export interface Comment {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  modifiedTime: string | null;
}

interface UseCardResult {
  loading: boolean;
  error: string | null;
  totalCommentPages: number;
  currentCommentPage: number;
  checkCard: (nickname: string, token?: string) => Promise<boolean>;
  createNewCard: (nickname: string, entries: EntryState[]) => Promise<void>;
  fetchOriginalCard: (
    nickname: string,
    type: FetchType,
    token?: string
  ) => Promise<{ id: number; name: string; entries: EntryState[] }>;
  fetchPublicCard: (
    nickname: string,
    type: FetchType,
    token?: string
  ) => Promise<{ id: number; name: string; entries: EntryState[] }>;
  editOriginalCard: (nickname: string, entries: EntryState[]) => Promise<void>;
  editPublicCard: (nickname: string, entries: EntryState[]) => Promise<void>;
  addComment: (
    poiId: number,
    nickname: string,
    content: string,
    token?: string
  ) => Promise<void>;
  fetchComments: (
    poiId: number,
    page: number,
    size: number,
    token?: string
  ) => Promise<any>;
  formatTimestamp: (timestamp: string) => string;
}

export const useCard = (): UseCardResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCommentPages, setTotalCommentPages] = useState<number>(1);
  const [currentCommentPage, setCurrentCommentPage] = useState<number>(0);
  const { showToast } = useToastMessage();

  const checkCard = async (nickname: string, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIsCreatedCard(nickname, token);
      console.log("checkCard_data:", data);
      console.log("checkCard_data.isCreated:", data.data.isCreated);
      return data.data.isCreated;
    } catch (error) {
      setError("카드를 확인하는 중 오류가 발생했습니다.");
      console.log("checkCard_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createNewCard = async (nickname: string, entries: EntryState[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createCardInfo(nickname, entries);
      return data;
    } catch (error) {
      setError("카드를 생성하는 중 오류가 발생했습니다.");
      console.log("createNewCard_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchOriginalCard = async (
    nickname: string,
    type: FetchType,
    token?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOriginalCardInfo(nickname, type, token);
      console.log("555:", data);
      return {
        id: data.data.id,
        name: data.data.name,
        entries: data.data.entries,
      };
    } catch (error) {
      setError("카드를 가져오는 중 오류가 발생했습니다.");
      console.log("fetchOriginalCard_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicCard = async (
    nickname: string,
    type: FetchType,
    token?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicCardInfo(nickname, type, token);
      console.log("fdd1:", data);
      return {
        id: data.data.id,
        name: data.data.name,
        entries: data.data.entries,
      };
    } catch (error) {
      setError("카드를 가져오는 중 오류가 발생했습니다.");
      console.log("fetchPublicCard_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editOriginalCard = async (nickname: string, entries: EntryState[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateOriginalCardInfo(nickname, entries);
      console.log("edit5Card_data:", data);
      return data;
    } catch (error) {
      setError("카드를 수정하는 중 오류가 발생했습니다.");
      console.log("editOriginalCard_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editPublicCard = async (nickname: string, entries: EntryState[]) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updatePublicCardInfo(nickname, entries);
      console.log("editPublicCard_data:", data);
      return data;
    } catch (error) {
      setError("카드를 수정하는 중 오류가 발생했습니다.");
      console.log("editPublicCard_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (
    poiId: number,
    nickname: string,
    content: string,
    token?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await createCardComment(poiId, nickname, content, token);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.code === 2260300) {
        showToast(
          "초대링크 제한",
          "초대링크당 하나의 댓글만 달 수 있습니다",
          "error"
        );
      } else {
        showToast("Error", "댓글을 등록하는 중 오류가 발생했습니다.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (
    poiId: number,
    page: number,
    size: number,
    token?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCardComments(poiId, page, size, token);
      const comments: Comment[] = data.data.comments.content.map(
        (comment: any) => ({
          id: comment.id,
          user: comment.author.nickName,
          content: comment.content,
          timestamp: comment.createdTime,
          modifiedTime: comment.modifiedTime,
          tagInfo: comment.tagInfo,
        })
      );
      setTotalCommentPages(data.data.comments.totalPages);
      setCurrentCommentPage(page);
      return comments;
    } catch (error) {
      setError("댓글을 가져오는 중 오류가 발생했습니다.");
      console.log("fetchComments_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const utcDate = new Date(timestamp + "Z"); //UTC 시간을 올바르게 파싱하기 위해 'Z'를 추가
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return utcDate.toLocaleString(undefined, options);
  };

  return {
    loading,
    error,
    totalCommentPages,
    currentCommentPage,
    checkCard,
    createNewCard,
    fetchOriginalCard,
    fetchPublicCard,
    editOriginalCard,
    editPublicCard,
    addComment,
    fetchComments,
    formatTimestamp,
  };
};
