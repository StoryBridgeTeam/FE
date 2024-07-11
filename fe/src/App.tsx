import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import LoginPage from "./domains/login/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif", // 전역 body 요소에 적용될 글꼴
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/id" element={<LoginPage/>}/>
      </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
