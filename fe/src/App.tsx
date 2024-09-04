import { ChakraProvider, extendTheme } from "@chakra-ui/react";
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

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
  },
});

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [initialized, setInitialized] = useState(false);
  const nickName = localStorage.getItem("nickName");

  useEffect(() => {
    checkAuth().then(() => {
      setInitialized(true);
    });
  }, [checkAuth]);

  if (!initialized) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
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
