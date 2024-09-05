import { VStack, Flex, useBreakpointValue } from "@chakra-ui/react";
import LoginAppBar from "../../common/components/LoginAppBar";
import LoginForm from "./components/LoginForm";

const LoginPage = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex minH="100vh" align="center" direction="column">
      <LoginAppBar />
      <VStack
        mt={isMobile ? "50px" : "60px"}
        minH={isMobile ? "calc(100vh - 50px)" : "calc(100vh - 60px)"}
        spacing={8}
        w="full"
        justify="center"
        align={"center"}
      >
        <LoginForm />
      </VStack>
    </Flex>
  );
};

export default LoginPage;
