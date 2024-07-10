import { VStack, Flex } from "@chakra-ui/react";
import LoginAppBar from "./components/LoginAppBar";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  return (
    <Flex minH="100vh" align="center" direction="column">
      <LoginAppBar />
      <VStack spacing={8} w="full" justify="center" mt={50}>
        <LoginForm />
      </VStack>
    </Flex>
  );
};

export default LoginPage;
