import React, {useState} from "react";
import {
    Box,
    Flex,
    Spinner,
} from "@chakra-ui/react";
import CommentItem from "./CommentItem";
import {UseCommentReturn} from "../../hooks/useComment";

export interface CommentPresenterProps {
    targetId: number,
    targetContent: string,
    isHost: boolean,
    highlightComment: (startIndex: number, endIndex: number) => void,
    useCommentHook: UseCommentReturn
}

const CommentPresenter = ({
                              targetId,
                              targetContent,
                              isHost,
                              highlightComment,
                              useCommentHook
                          }: CommentPresenterProps) => {
    return <Box
        // ref={scrollRef}
        border="1px"
        borderColor="#EEEEEE"
        p={4}
        mb={10}
        h={"100%"}
        overflowY="auto"
        // onScroll={handleScroll} // Add scroll event listener
    >
        {useCommentHook.loading ? (
            <Flex justifyContent="center" mt={4}>
                <Spinner/>
            </Flex>
        ):
            useCommentHook.comments.map((comment) => (
                    <CommentItem targetId={targetId} content={targetContent} comment={comment} ishost={isHost}
                                 highlightComment={highlightComment} useCommentHook={useCommentHook}/>
                ))
        }
    </Box>;
}

export default CommentPresenter;