import React, {useEffect, useLayoutEffect} from "react";
import {Flex, Box, useBreakpointValue, Spinner, Stack, Divider} from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";
import { useAuthStore } from "../../common/stores/AuthStore";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import { useNavigate } from "react-router-dom";
import CardModalComponent from "./components/CardModalComponent";
import LoginAppBar from "../../common/components/LoginAppBar";
import { useCard } from "./hooks/useCard";
import CommentList from "./components/CommentList";
import FirstCardModal from "./components/FirstCardModal";
import CommentPresenter from "../../common/components/comment/CommentPresenter";
import useComment from "../../common/hooks/useComment";
import {createCardComment, deleteComment, getCardComments, updateComment} from "./api/cardAPI";
import CommentInput from "../../common/components/comment/CommentInput";

const CardPage: React.FC = () => {
  const { nickName="" } = useParams<{ nickName: string }>();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToastMessage();
  const navigate = useNavigate();
  const location = useLocation();
  // const { name, cardId, hasCard } = location.state || {};
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

    const savedNickName = localStorage.getItem("nickName");
    const isHost = nickName === savedNickName;

  const useCardHook = useCard({nickname:nickName});
const { loading, error, createNewCard, isExists, cardId} = useCardHook;

    useEffect(() => {
        if(token){
            useCardHook.checkCard(nickName, token);
        }else{
            useCardHook.checkCard(nickName);
        }
    }, []);

  return (
    <Flex minH="100vh" direction="column">
      <LoginAppBar isShowSearch={true} />
      <Flex
        mt={isMobile ? "50px" : "60px"}
        minH={isMobile ? "calc(100vh - 50px)" : "calc(100vh - 80px)"}
        direction={isMobile ? "column" : "row"}
        justifyContent={"center"}
      >
          {
              isExists==null ?
                  <Flex w={"100%"} alignItems={"center"} justifyContent={"center"}>
                      <Spinner />
                  </Flex> :
                  <>
                  <Flex
                      flex={2}
                      direction="column"
                      width={{ base: "100%", md: isExists ? "70%" : "60%" }}
                      minWidth={isMobile ? "none" : "650px"}
                      maxWidth={"750px"}
                      bg="white"
                      p={4}
                  >
                      {isExists ? (
                          <CardModalComponent
                              nickName={nickName!}
                              useCardHook={useCardHook}
                          />
                      ) : (
                          <FirstCardModal nickName={nickName!} useCardHook={useCardHook}/>
                      )}
                  </Flex>
                  {
                      isMobile ?
                          <Divider orientation='horizontal' />
                          :
                          <Divider orientation='vertical' h={"calc(100vh - 50px)"}/>
                  }
                      <Box flex={1} padding={2}  minWidth={"330px"} maxWidth={isMobile? "none" : "500px"}>
                      {
                          isExists &&
                          <CommentBox cardId={cardId} isHost={isHost} token={token}/>
                      }
                      {/*{isExist ? (*/}
                      {/*  <CommentList nickName={nickName!} cardId={cardId} />*/}
                      {/*) : null}*/}
                  </Box>
                  </>
          }
    </Flex>
    </Flex>
  );
};

interface CommentBoxProps{
    cardId : number
    isHost:boolean,
    token?:string|null
}

const CommentBox = ({cardId,isHost, token}:CommentBoxProps) => {
    const useCommentHook = useComment({
        targetId:cardId, fetchCommentAPI:getCardComments, editCommentAPI:updateComment, deleteCommentAPI:deleteComment, tagCommentAPI:undefined, createCommentAPI:createCardComment, token
    })

    return <Stack>
        <CommentInput commentHook={useCommentHook} />
        <CommentPresenter targetId={cardId} targetContent={""} isHost={isHost} highlightComment={()=>{}} useCommentHook={useCommentHook} />
    </Stack>;
}

export default CardPage;
