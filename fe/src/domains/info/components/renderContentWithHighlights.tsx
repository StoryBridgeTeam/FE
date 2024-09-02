import React from "react";
import {Comment} from "../../../common/hooks/useComment";

// export const renderContentWithHighlights = (
//   content: string,
//   comments: { startIndex?: number; endIndex?: number }[],
// ) => {
//   let segments: JSX.Element[] = [];
//   let lastIndex = 0;
//
//   const sortedComments = comments
//     .filter(
//       (comment) =>
//         comment.startIndex !== undefined && comment.endIndex !== undefined
//     )
//     .sort((a, b) => (a.startIndex as number) - (b.startIndex as number));
//
//   sortedComments.forEach((comment, index) => {
//     if (comment.startIndex !== undefined && comment.endIndex !== undefined) {
//       if (comment.startIndex > lastIndex) {
//         segments.push(
//           <React.Fragment key={`before-${index}`}>
//             {content.substring(lastIndex, comment.startIndex)}
//           </React.Fragment>
//         );
//       }
//
//       segments.push(
//         <span
//           id={`highlight-${index}`}
//           key={`highlight-${index}`}
//           className="highlight"
//           style={{
//             backgroundColor: "yellow",
//             cursor: "pointer",
//             userSelect: "none",
//           }}
//         >
//           {content.substring(comment.startIndex, comment.endIndex)}
//         </span>
//       );
//
//       lastIndex = comment.endIndex;
//     }
//   });
//
//   if (lastIndex < content.length) {
//     segments.push(
//       <React.Fragment key="last">{content.substring(lastIndex)}</React.Fragment>
//     );
//   }
//
//   return segments;
// };

export const renderContentWithHighlights = (
    content: string,
    rawComments: Comment[],
) => {
  const comments = rawComments.map((comment) => ({
    content: comment.content,
    startIndex: comment.tagInfo?.startIndex || 0,
    endIndex: comment.tagInfo?.lastIndex || 0,
  }));

  let segments: JSX.Element[] = [];
  let lastIndex = 0;

  const sortedComments = comments
      .filter(
          (comment) =>
              comment.startIndex !== undefined && comment.endIndex !== undefined
      )
      .sort((a, b) => (a.startIndex as number) - (b.startIndex as number));

  sortedComments.forEach((comment, index) => {
    if (comment.startIndex !== undefined && comment.endIndex !== undefined) {
      if (comment.startIndex > lastIndex) {
        segments.push(
            <React.Fragment key={`before-${index}`}>
              {content.substring(lastIndex, comment.startIndex)}
            </React.Fragment>
        );
      }

      segments.push(
          <span
              id={`highlight-${index}`}
              key={`highlight-${index}`}
              className="highlight"
              style={{
                backgroundColor: "yellow",
                cursor: "pointer",
                userSelect: "none",
              }}
          >
          {content.substring(comment.startIndex, comment.endIndex)}
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
