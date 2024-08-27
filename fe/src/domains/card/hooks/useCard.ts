import { useState } from "react";
import {
  getIsCreatedCard,
  createCardInfo,
  getOriginalCardInfo,
  updateOriginalCardInfo,
  getPublicCardInfo,
  updatePublicCardInfo,
} from "../api/cardAPI";
import { EntryState, FetchType } from "../types/cardTypes";

interface UseCardResult {
  name: string;
  loading: boolean;
  error: string | null;
  checkCard: (nickname: string) => Promise<boolean>;
  createNewCard: (nickname: string, entries: EntryState[]) => Promise<void>;
  fetchOriginalCard: (
    nickname: string,
    type: FetchType
  ) => Promise<EntryState[]>;
  fetchPublicCard: (nickname: string, type: FetchType) => Promise<EntryState[]>;
  editOriginalCard: (nickname: string, entries: EntryState[]) => Promise<void>;
  editPublicCard: (nickname: string, entries: EntryState[]) => Promise<void>;
}

export const useCard = (): UseCardResult => {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkCard = async (nickname: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIsCreatedCard(nickname);
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

  const fetchOriginalCard = async (nickname: string, type: FetchType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOriginalCardInfo(nickname, type);
      return data.entries;
    } catch (error) {
      setError("카드를 가져오는 중 오류가 발생했습니다.");
      console.log("fetchOriginalCard_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicCard = async (nickname: string, type: FetchType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicCardInfo(nickname, type);
      setName(data.name);
      return data.entries;
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
      return data;
    } catch (error) {
      setError("카드를 수정하는 중 오류가 발생했습니다.");
      console.log("editPublicCard_error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    loading,
    error,
    checkCard,
    createNewCard,
    fetchOriginalCard,
    fetchPublicCard,
    editOriginalCard,
    editPublicCard,
  };
};
