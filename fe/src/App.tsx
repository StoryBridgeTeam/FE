import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import SignupPage from "./domains/signup/SignupPage";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif", // 전역 body 요소에 적용될 글꼴
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <SignupPage />
    </ChakraProvider>
  );
}

export default App;
