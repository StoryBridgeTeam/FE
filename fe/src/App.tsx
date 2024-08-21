import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import LoginPage from "./domains/login/LoginPage";
import SignupPage from "./domains/signup/SignupPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./domains/login/stores/useAuthStore";
import { useEffect, useState } from "react";
import PrivateRoute from "./domains/login/utils/PrivateRoute";
import InfoPage from "./domains/info/InfoPage";
import MainPage from "./domains/main/MainPage";
import MyPage from "./domains/mypage/MyPage";
import AmtPage from "./domains/amt/AmtPage";

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
            element={<PrivateRoute element={<InfoPage />} />}
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
