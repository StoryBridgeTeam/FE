import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import LoginPage from "./domains/login/LoginPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAuthStore } from "./domains/login/stores/useAuthStore";
import { useEffect } from "react";
import PrivateRoute from "./domains/login/stores/PrivateRoute";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif", // 전역 body 요소에 적용될 글꼴
  },
});

function App() {
  const {checkAuth, isAuthenticated} = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
          <Route path="/:id" element={<PrivateRoute element={<LoginPage />} />} />
          {/* <Route path="/:id/info" element={<PrivateRoute element={<InfoPage />} />} /> */}
          <Route
            path="*"
            element={
              isAuthenticated ? <Navigate to="/:id" /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
