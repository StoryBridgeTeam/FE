import React from "react";
import { BiMessageDetail } from "react-icons/bi";

export const renderContentWithIcons = (
  content: string,
  comments: {
    id: number;
    content: string;
    startIndex?: number;
    endIndex?: number;
  }[],
  scrollToHighlightedText: (startIndex?: number, endIndex?: number) => void
) => {
  let segments: JSX.Element[] = [];
  let lastIndex = 0;

  const sortedComments = comments
    .filter(
      (comment) =>
        comment.startIndex !== undefined && comment.endIndex !== undefined
    )
    .sort((a, b) => (a.startIndex as number) - (b.startIndex as number));

  sortedComments.forEach((comment, index) => {
    if (
      comment.startIndex !== undefined &&
      comment.endIndex !== undefined &&
      (comment.startIndex !== 0 || comment.endIndex !== 0)
    ) {
      if (comment.startIndex > lastIndex) {
        segments.push(
          <React.Fragment key={`before-${comment.id}`}>
            {content.substring(lastIndex, comment.startIndex)}
          </React.Fragment>
        );
      }

      segments.push(
        <span
          id={`highlight-${comment.id}`}
          key={`highlight-${comment.id}`}
          className="highlight"
          style={{
            cursor: "pointer",
            position: "relative",
          }}
        >
          {content.substring(comment.startIndex, comment.endIndex)}
          <span
            style={{
              color: "#e6b800",
              position: "absolute",
              right: "-5px",
              top: "8%",
              transform: "translateY(-50%)",
              fontSize: "0.8em",
            }}
            onClick={(e) => {
              e.stopPropagation();
              scrollToHighlightedText(comment.startIndex, comment.endIndex);
            }}
          >
            <BiMessageDetail />
          </span>
        </span>
      );

      lastIndex = comment.endIndex;
    }
  });

  if (lastIndex < content.length) {
    segments.push(
      <React.Fragment key="last">{content.substring(lastIndex)}</React.Fragment>
    );
  }

  return segments;
};
