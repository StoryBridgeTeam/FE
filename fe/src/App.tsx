import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import LoginPage from "./domains/login/LoginPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./domains/login/stores/useAuthStore";
import { useEffect, useState } from "react"; // useState 추가
import PrivateRoute from "./domains/login/utils/PrivateRoute";
import InfoPage from "./domains/info/InfoPage";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif", // 전역 body 요소에 적용될 글꼴
  },
});

function App() {
  const { checkAuth, isAuthenticated, id } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    checkAuth().then(() => {
      setInitialized(true);
    });
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path={`/${id}`}
            element={<PrivateRoute element={<InfoPage />} />}
          />
          <Route
            path={`/${id}/info`}
            element={<PrivateRoute element={<InfoPage />} />}
          />
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to={`/${id}/info`} replace />
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
