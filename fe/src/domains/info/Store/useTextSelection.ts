import { useState } from "react";
import { useCommentStore } from "./CommentStore";

export const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState<{
    text: string;
    startIndex: number;
    endIndex: number;
  } | null>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      const startOffset = getOffset(range.startContainer, range.startOffset);
      const endOffset = getOffset(range.endContainer, range.endOffset);

      const text = selection.toString();
      if (text.trim().length > 0) {
        setSelectedText({ text, startIndex: startOffset, endIndex: endOffset });
      }
    }
  };

  const getOffset = (node: Node, offset: number): number => {
    let totalOffset = 0;

    const traverseNodes = (currentNode: Node) => {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        if (currentNode === node) {
          totalOffset += offset;
          return true;
        } else {
          totalOffset += (currentNode as Text).textContent?.length || 0;
        }
      } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const childNodes = currentNode.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
          if (traverseNodes(childNodes[i])) {
            return true;
          }
        }
      }
      return false;
    };

    const parentNode = node.parentNode;
    if (parentNode) {
      const children = parentNode.childNodes;
      for (let i = 0; i < children.length; i++) {
        if (traverseNodes(children[i])) {
          break;
        }
      }
    }

    return totalOffset;
  };

  const handleCommentSubmit = (text: string) => {
    const addComment = useCommentStore.getState().addComment;
    if (selectedText) {
      const newComment = {
        text,
        timestamp: new Date().toISOString(),
        username: "User Name",
        startIndex: selectedText.startIndex,
        endIndex: selectedText.endIndex,
      };
      addComment(newComment);
      setSelectedText(null);
    } else {
      const newComment = {
        text,
        timestamp: new Date().toISOString(),
        username: "User Name",
      };
      addComment(newComment);
      setSelectedText(null);
    }
  };

  const handleClearSelectedText = () => {
    setSelectedText(null);
  };

  return {
    selectedText,
    handleMouseUp,
    handleClearSelectedText,
    handleCommentSubmit,
  };
};
