import { useState, useEffect } from "react";
import {
  getTitles,
  getPOI,
  createPOI,
  updatePOI,
  deletePOI,
  updatePOIIndexes,
  createPOIComment,
  getPOIComments,
  linkPOICommentTag,
} from "../../poi/api/poiAPI";

export interface POI {
  id: number | null;
  title: string;
  content: string;
  index: number;
}

export interface Comment {
  id: number;
  user: string;
  content: string;
  timestamp: string;
  modifiedTime: string | null;
  tagInfo: {
    startIndex: number;
    lastIndex: number;
  } | null;
}

interface UsePOIResult {
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  totalCommentPages: number;
  currentCommentPage: number;
  fetchTitles: (
    nickname: string,
    page: number,
    size: number,
    token?: string
  ) => Promise<POI[]>;
  fetchPOI: (nickname: string, poiId: number, token?: string) => Promise<POI>;
  addPOI: (nickname: string, poiData: POI) => Promise<void>;
  modifyPOI: (poiId: number, poiData: POI) => Promise<void>;
  removePOI: (poiId: number) => Promise<void>;
  reorderPOIs: (
    nickname: string,
    modifyList: { id: number; index: number }[]
  ) => Promise<void>;
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
  linkCommentTag: (
    poiId: number,
    commentId: number,
    startIndex: number,
    lastIndex: number,
    token?: string
  ) => Promise<void>;
}

export const usePOI = (): UsePOIResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalCommentPages, setTotalCommentPages] = useState<number>(1);
  const [currentCommentPage, setCurrentCommentPage] = useState<number>(0);

  const fetchTitles = async (
    nickname: string,
    page: number,
    size: number,
    token?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTitles(nickname, page, size, token);
      const titles = data.data.content || [];
      setTotalPages(data.data.totalPages);
      setCurrentPage(page);
      return titles;
    } catch (error) {
      setError("Title을 가져오는 중 오류가 발생했습니다.");
      console.log("fetchTitles_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchPOI = async (nickname: string, poiId: number, token?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPOI(nickname, poiId, token);
      const poi = data.data;
      return poi;
    } catch (error) {
      setError("POI를 가져오는 중 오류가 발생했습니다.");
      console.log("fetchPOIs_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addPOI = async (nickname: string, poiData: POI) => {
    setLoading(true);
    setError(null);
    try {
      await createPOI(nickname, poiData);
    } catch (error) {
      setError("POI를 생성하는 중 오류가 발생했습니다.");
      console.log("addPOI_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const modifyPOI = async (poiId: number, poiData: POI) => {
    setLoading(true);
    setError(null);
    try {
      await updatePOI(poiId, poiData);
    } catch (error) {
      setError("POI를 수정하는 중 오류가 발생했습니다.");
      console.log("modifyPOI_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removePOI = async (poiId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deletePOI(poiId);
    } catch (error) {
      setError("POI를 삭제하는 중 오류가 발생했습니다.");
      console.log("removePOI_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reorderPOIs = async (
    nickname: string,
    modifyList: { id: number; index: number }[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      await updatePOIIndexes(nickname, modifyList);
    } catch (error) {
      setError("POI 인덱스를 수정하는 중 오류가 발생했습니다.");
      console.log("reorderPOIs_error:", error);
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
      await createPOIComment(poiId, nickname, content, token);
    } catch (error) {
      setError("댓글을 생성하는 중 오류가 발생했습니다.");
      console.log("addComment_error:", error);
      throw error;
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
      const data = await getPOIComments(poiId, page, size, token);
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

      //여기서 isPoIOwner등을 처리해야할듯

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

  const linkCommentTag = async (
    poiId: number,
    commentId: number,
    startIndex: number,
    lastIndex: number,
    token?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await linkPOICommentTag(poiId, commentId, startIndex, lastIndex, token);
    } catch (error) {
      setError("댓글 태그 연결 중 오류가 발생했습니다.");
      console.log("linkCommentTag_error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    totalPages,
    currentPage,
    totalCommentPages,
    currentCommentPage,
    fetchTitles,
    fetchPOI,
    addPOI,
    modifyPOI,
    removePOI,
    reorderPOIs,
    addComment,
    fetchComments,
    linkCommentTag,
  };
};
