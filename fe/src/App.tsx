import {Box, ChakraProvider, extendTheme, useToast} from "@chakra-ui/react";
import LoginPage from "./domains/login/LoginPage";
import SignupPage from "./domains/signup/SignupPage";
import {BrowserRouter, Route, Routes, Navigate, useNavigate} from "react-router-dom";
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
import AdminPolicyPage from "./domains/policy/page/AdminPolicyPage";
import CoverLetterDetailPage from "./domains/info/page/CoverLetterDetailPage";
import CoverLetterEditPage from "./domains/info/page/CoverLetterEditPage";
import OauthSignupPage from "./domains/signup/page/OauthSignupPage";
import SignupInitialPage from "./domains/signup/page/SignupInitialPage";
import OauthProcessingPage from "./domains/signup/page/OauthProcessingPage";
import OauthSelectAccountPage from "./domains/signup/page/OauthSelectAccountPage";
import PayPolicyPage from "./domains/policy/page/PayPolicyPage";
import ChatMainPage from "./domains/chat/page/ChatMainPage";
import axios from "axios";
import {Stomp} from "@stomp/stompjs";
import {SocketStore} from "./domains/chat/store/WebSocketStore";
import ChatPage from "./domains/chat/page/ChatMainPage";
import {ChatAlarmStore} from "./domains/chat/store/GlobalChatStore";
import {useToastMessage} from "./common/hooks/useToastMessage";
import {useChatAlarmToast} from "./domains/chat/hook/useChatAlarmToast";
import {retrieveUnReadMessages} from "./domains/chat/api/ChatAPI";
import ServicePolicyPage from "./domains/policy/page/ServicePolicyPage";
import PrivacyPolicyPage from "./domains/policy/page/PrivacyPolicyPage";
import RefundPolicyPage from "./domains/policy/page/RefundPolicyPage";
import {setUpAxiosInstance} from "./common/api/axiosInstance";
import {useErrorStore} from "./common/stores/ErrorStore";

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
  const {stompClient, setStompClient, loading:stompLoading, setLoading:setStompLoading} = SocketStore();
  const {addMessage, initBulkMessage} = ChatAlarmStore();

  const errorStore = useErrorStore();

  useEffect(() => {
    checkAuth().then(() => {
      setInitialized(true);
    });
  }, [checkAuth]);

  useEffect(() => {
    setUpAxiosInstance(errorStore);
  }, []);


  async function initChatSocket() {
    setStompLoading(true);
    if(isAuthenticated && (!stompClient || !stompClient?.connected)){
      if(!stompLoading){
        const socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_CHAT_SERVER}/ws`);
        const newStompClient = Stomp.over(socket);
        newStompClient.connect({}, () => {
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
    setStompLoading(false);
  }

  const fetchUnReadMsg = async () => {
    const unReadMsgs = await retrieveUnReadMessages();
    initBulkMessage(unReadMsgs.filter(msg => msg.senderId!=myId));
  }

  useEffect(() => {
    if(isAuthenticated && (!stompClient || !stompClient?.connected===false)){
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
          <Route path="/policy/service" element={<ServicePolicyPage />} />
          <Route path="/policy/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/policy/pay" element={<PayPolicyPage />} />
          <Route path="/policy/refund" element={<RefundPolicyPage />} />
          <Route
            path="/chat"
            element={<ChatPage />}
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
            element={<PrivateRoute element={<AdminPolicyPage />} />}
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
