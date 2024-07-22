import create from "zustand";

interface Comment {
  text: string;
  timestamp: string;
  username: string;
  startIndex?: number;
  endIndex?: number;
}

interface CommentStore {
  comments: Comment[];
  addComment: (
    comment: Omit<Comment, "timestamp"> & { timestamp: string }
  ) => void;
  deleteComment: (index: number) => void;
  updateCommentText: (index: number, text: string) => void;
  updateCommentIndexes: (
    index: number,
    startIndex: number,
    endIndex: number
  ) => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  addComment: (comment) =>
    set((state) => ({
      comments: [...state.comments, comment],
    })),
  deleteComment: (index) =>
    set((state) => ({
      comments: state.comments.filter((_, i) => i !== index),
    })),
  updateCommentText: (index, text) =>
    set((state) => ({
      comments: state.comments.map((comment, i) =>
        i === index ? { ...comment, text } : comment
      ),
    })),
  updateCommentIndexes: (index, startIndex, endIndex) =>
    set((state) => ({
      comments: state.comments.map((comment, i) =>
        i === index ? { ...comment, startIndex, endIndex } : comment
      ),
    })),
}));
