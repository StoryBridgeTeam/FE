import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import LoginPage from "./domains/login/LoginPage";
import SignupPage from "./domains/signup/SignupPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./domains/login/stores/useAuthStore";
import { useEffect, useState } from "react";
import PrivateRoute from "./domains/login/utils/PrivateRoute";
import InfoPage from "./domains/info/InfoPage";
import MainPage from "./domains/main/MainPage";
import { getNicknameToken } from "./common/utils/nickname";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
  },
});

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

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
            path="*"
            element={
              isAuthenticated && getNicknameToken() ? (
                <Navigate to={`/${getNicknameToken()}`} replace />
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
