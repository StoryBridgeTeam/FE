import create from "zustand";

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
}

interface TagInfo {
  startIndex: number;
  lastIndex: number;
}

interface CommentState {
  comments: Comment[];
  setComments: (comments: Comment[]) => void;
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
  addComments: (newComment) => {
    set((state) => ({
      comments: [...state.comments, newComment],
    }));
  },
  deleteComment: (id) =>
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
