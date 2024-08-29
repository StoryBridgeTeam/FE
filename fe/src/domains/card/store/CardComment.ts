import create from "zustand";

interface Comment {
  id: number;
  content: string;
  author: {
    nickName: string;
  };
  createdTime: string;
}

interface CommentStore {
  comments: Comment[];
  setCardComments: (comments: Comment[]) => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  comments: [],
  setCardComments: (comments) => set({ comments }),
}));
