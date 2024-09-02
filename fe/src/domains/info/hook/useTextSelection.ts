import { useState } from "react";
import { useCommentStore } from "../Store/CommentStore";

export interface HighlightedText {
  text: string;
  startIndex: number;
  endIndex: number;
}

export const useTextSelection = () => {
  const [selectedText, setSelectedText] = useState<HighlightedText | null>(null);

  const comments = useCommentStore((state) => state.comments);

  const handleSelectionEnd = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startOffset = getOffset(range.startContainer, range.startOffset);
      const endOffset = getOffset(range.endContainer, range.endOffset);

      const text = selection.toString();
      if (text.trim().length > 0) {
        const intersects = comments.some((comment) => {
          const tagInfo = comment.tagInfo;
          return (
            tagInfo &&
            tagInfo.startIndex !== undefined &&
            tagInfo.lastIndex !== undefined &&
            (tagInfo.startIndex !== 0 || tagInfo.lastIndex !== 0) &&
            startOffset < tagInfo.lastIndex &&
            endOffset > tagInfo.startIndex
          );
        });

        if (!intersects && startOffset < endOffset) {
          setSelectedText({
            text,
            startIndex: startOffset,
            endIndex: endOffset,
          });
        } else {
          window.getSelection()?.removeAllRanges();
        }
      }
    }
  };

  const getOffset = (node: Node, offset: number): number => {
    let totalOffset = 0;

    const traverseNodes = (currentNode: Node): boolean => {
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

  const handleClearSelectedText = () => {
    setSelectedText(null);
  };

  return {
    selectedText,
    handleMouseUp: handleSelectionEnd,
    handleTouchEnd: handleSelectionEnd,
    handleClearSelectedText,
  };
};
