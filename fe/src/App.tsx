import {Box, ChakraProvider, extendTheme, useToast} from "@chakra-ui/react";
import LoginPage from "./domains/login/LoginPage";
import SignupPage from "./domains/signup/SignupPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./common/stores/AuthStore";
import React, { useEffect, useState } from "react";
import PrivateRoute from "./domains/login/utils/PrivateRoute";
import InfoPageLayout from "./domains/info/InfoPageLayout";
import MainPage from "./domains/main/MainPage";
import MyPage from "./domains/mypage/MyPage";
import AmtPage from "./domains/amt/AmtPage";
import POIPage from "./domains/poi/POIPage";
import DetailPage from "./domains/info/components/DetailPage";
import CardPage from "./domains/card/CardPage";
import CoverLetterCreatePage from "./domains/info/page/CoverLetterCreatePage";
import InfoMainPage from "./domains/info/page/InfoMainPage";
import PolicyPage from "./domains/policy/PolicyPage";
import CoverLetterDetailPage from "./domains/info/page/CoverLetterDetailPage";
import CoverLetterEditPage from "./domains/info/page/CoverLetterEditPage";
import OauthSignupPage from "./domains/signup/page/OauthSignupPage";
import SignupInitialPage from "./domains/signup/page/SignupInitialPage";
import OauthProcessingPage from "./domains/signup/page/OauthProcessingPage";
import OauthSelectAccountPage from "./domains/signup/page/OauthSelectAccountPage";
import PayPolicyPage from "./common/page/PayPolicyPage";
import ChatMainPage from "./domains/chat/page/ChatMainPage";
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import {SocketStore} from "./domains/chat/store/WebSocketStore";
import ChatPage from "./domains/chat/page/ChatMainPage";
import {ChatAlarmStore} from "./domains/chat/store/GlobalChatStore";
import {useToastMessage} from "./common/hooks/useToastMessage";
import {useChatAlarmToast} from "./domains/chat/hook/useChatAlarmToast";
import {retrieveUnReadMessages} from "./domains/chat/api/ChatAPI";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
  },
});

function App() {
  const { checkAuth, isAuthenticated, accessToken } = useAuthStore();
  const [initialized, setInitialized] = useState(false);
  const nickName = localStorage.getItem("nickName");
  const {memberId : myId} = useAuthStore();
  const {stompClient, setStompClient} = SocketStore();
  const {addMessage, addBulkMessage} = ChatAlarmStore();

  useEffect(() => {
    checkAuth().then(() => {
      setInitialized(true);
    });
  }, [checkAuth]);

  async function initChatSocket() {
    if(isAuthenticated){
      const socket = new WebSocket("ws://localhost:8788/ws");
      const newStompClient = Stomp.over(socket);
      newStompClient.connect({"Authorization" : `Bearer ${accessToken}`}, () => {
        fetchUnReadMsg();

        newStompClient.subscribe(`/sub/myRoom/${myId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          addMessage(newMessage);
        });
      });

      // newStompClient.onDisconnect = () => {
      //   setTimeout(() => {initChatSocket()}, 1000);
      // }
      //
      // socket.onclose = () => {
      //   setTimeout(() => {initChatSocket()}, 1000);
      // }
      setStompClient(newStompClient);
    }
  }

  const fetchUnReadMsg = async () => {
    const unReadMsgs = await retrieveUnReadMessages();
    addBulkMessage(unReadMsgs);
  }

  useEffect(() => {
    if(isAuthenticated && (!stompClient || !stompClient?.connected)){
      initChatSocket();
    }
  }, [isAuthenticated, stompClient?.connected]);

  if (!initialized) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/oauth/processing" element={<OauthProcessingPage />}/>
          <Route path="/signup/oauth/select" element={<OauthSelectAccountPage/> }/>
          <Route path="/signup/oauth" element={<OauthSignupPage/> }/>
          <Route path="/signup/storybridge" element={<SignupPage />} />
          <Route path="/signup" element={<SignupInitialPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pay-policy" element={<PayPolicyPage />} />
          <Route
              path="/chat"
              element={<PrivateRoute element={<ChatPage />} />}
          />
          <Route
            path="/:nickName"
            element={<PrivateRoute element={<MainPage />} />}
          />
          <Route
            path="/:nickName/info"
            element={<PrivateRoute element={<InfoMainPage />} />}
          />
          <Route
            path="/info/create"
            element={<PrivateRoute element={<CoverLetterCreatePage />} />}
          />
          <Route
            path="/:nickName/info/:id"
            element={<PrivateRoute element={<CoverLetterDetailPage />} />}
          />
          <Route
              path="/:nickName/info/:id/edit"
              element={<PrivateRoute element={<CoverLetterEditPage />} />}
          />
          <Route
            path="/:nickName/amt"
            element={<PrivateRoute element={<AmtPage />} />}
          />
          <Route
            path="/mypage"
            element={<PrivateRoute element={<MyPage />} />}
          />
          <Route
            path="/:nickName/poi/:poiId"
            element={<PrivateRoute element={<POIPage />} />}
          />
          <Route
            path="/:nickName/poi/create"
            element={<PrivateRoute element={<POIPage />} />}
          />
          <Route
            path="/:nickName/poi/:poiId/modify"
            element={<PrivateRoute element={<POIPage />} />}
          />
          <Route
            path="/:nickName/card"
            element={<PrivateRoute element={<CardPage />} />}
          />
          <Route
            path="/admin/policy"
            element={<PrivateRoute element={<PolicyPage />} />}
          />
          <Route
            path="*"
            element={
              isAuthenticated && nickName ? (
                <Navigate to={`/${nickName}`} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
