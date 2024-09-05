import { useState, useEffect, useCallback, useRef } from "react";
import { getSearchResult } from "../api/searchAPI";

interface ProfileImage {
  id: number;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

interface Member {
  nickname: string;
  profileImage: ProfileImage;
}

const useSearch = () => {
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(5);
  const [content, setContent] = useState<Member[]>([]);
  const [lastPage, setLastPage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchSearchedUser = useCallback(async () => {
    if (!keyword || keyword.length < 1) return;

    setIsLoading(true);
    try {
      const data = await getSearchResult(keyword, page, size);
      if (page === 0) {
        setContent(data.content || []);
      } else {
        setContent((prevContent) => [...prevContent, ...(data.content || [])]);
      }
      setLastPage(data.last);
    } catch (error) {
      console.error("Failed to search users:", error);
      setContent([]);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, page, size]);

  useEffect(() => {
    fetchSearchedUser();
  }, [fetchSearchedUser]);

  const loadMore = useCallback(() => {
    if (!lastPage && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [lastPage, isLoading]);

  const setObserver = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !lastPage) {
            loadMore();
          }
        },
        { threshold: 1.0 }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loadMore, lastPage, isLoading]
  );

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setPage(0);
    setContent([]);
  };

  return {
    keyword,
    content,
    handleKeywordChange,
    setObserver,
  };
};

export default useSearch;
