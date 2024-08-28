import create from "zustand";

interface Comment {
  id: number;
  content: string;
  author: {
    nickName: string;
  };
  createdTime: string;
  tagInfo?: {
    startIndex: number;
    lastIndex: number;
  };
}

interface CommentStore {
  comments: Comment[];
  setPOIComments: (comments: Comment[]) => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  setPOIComments: (comments) => set({ comments }),
}));
