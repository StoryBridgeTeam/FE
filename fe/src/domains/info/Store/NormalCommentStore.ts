import create from "zustand";

// `timestamp`를 문자열로 저장하여 직렬화 문제를 해결합니다.
interface NormalComment {
  text: string;
  timestamp: string; // Date 객체를 문자열로 변환
  username: string;
}

interface NormalCommentStore {
  comments: NormalComment[];
  addComment: (
    comment: Omit<NormalComment, "timestamp"> & { timestamp: string }
  ) => void;
  deleteComment: (index: number) => void;
  updateComment: (index: number, text: string) => void;
}

export const useNormalCommentStore = create<NormalCommentStore>((set) => ({
  comments: [],
  addComment: (comment) =>
    set((state) => ({ comments: [...state.comments, comment] })),
  deleteComment: (index) =>
    set((state) => ({
      comments: state.comments.filter((_, i) => i !== index),
    })),
  updateComment: (index, text) =>
    set((state) => ({
      comments: state.comments.map((comment, i) =>
        i === index ? { ...comment, text } : comment
      ),
    })),
}));
