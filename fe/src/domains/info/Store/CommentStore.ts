import create from "zustand";
import { ImageData } from "../../poi/hooks/usePOI";

interface Comment {
  id: number;
  author: Author;
  content: string;
  createdTime: string;
  modifiedTime: string | null;
  tagInfo: TagInfo | null;
}

interface Author {
  name: string;
  nickName: string;
  role: string;
  profileImage: ImageData;
}

interface TagInfo {
  startIndex: number;
  lastIndex: number;
}

interface CommentState {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
  setMoreComments: (comments: Comment[]) => void;
  addComments: (newComment: Comment) => void;
  deleteComment: (id: number) => void;
  updateCommentText: (id: number, newText: string) => void;
  updateCommentIndexes: (
    id: number,
    startIndex: number,
    endIndex: number
  ) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  setComments: (comments) => set({ comments }),
  setMoreComments: (comments) => set({ comments }),
  addComments: (newComment) => {
    set((state) => ({
      comments: [newComment, ...state.comments],
    }));
  },
  deleteComment: async (id) =>
    set((state) => ({
      comments: state.comments.filter((comment) => comment.id !== id),
    })),
  updateCommentText: (id, newText) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id ? { ...comment, content: newText } : comment
      ),
    })),
  updateCommentIndexes: (id, startIndex, endIndex) =>
    set((state) => ({
      comments: state.comments.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              tagInfo: {
                ...(comment.tagInfo || {}),
                startIndex,
                lastIndex: endIndex,
              },
            }
          : comment
      ),
    })),
}));
