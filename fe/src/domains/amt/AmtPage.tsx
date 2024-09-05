import { Flex, useBreakpointValue, Box } from "@chakra-ui/react";
import LoginAppBar from "../../common/components/LoginAppBar";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import AmtTree from "./components/AmtTree";
import NetWork from "./components/NewWork";
import { useAuthStore } from "../../common/stores/AuthStore";

const AmtPage: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToastMessage();
  const navigate = useNavigate();
  return (
    <Flex minH="100vh" direction="column">
      <LoginAppBar />
      <Flex
          maxW={"1440px"}
          mx={isMobile ? "none" : "auto"}
        mt={isMobile ? "30px" : "60px"}
        minH={isMobile ? "calc(100vh - 50px)" : "calc(100vh - 60px)"}
        direction={isMobile ? "column-reverse" : "row"}
        justifyContent={"start"}
        paddingX={10}
        paddingY={10}
          gap={2}
      >
          <AmtTree />
          <Box flex={2}>
              <NetWork />
          </Box>
      </Flex>
    </Flex>
  );
};

export default AmtPage;
