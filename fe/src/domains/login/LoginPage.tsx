import { VStack, Flex, useBreakpointValue } from "@chakra-ui/react";
import LoginAppBar from "./components/LoginAppBar";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex minH="100vh" align="center" direction="column">
      <LoginAppBar />
      <VStack spacing={8} w="full" justify="center" mt={isMobile ? 0 : 50}>
        <LoginForm />
      </VStack>
    </Flex>
  );
};

export default LoginPage;
