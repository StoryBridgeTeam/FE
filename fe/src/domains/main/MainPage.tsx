import React from "react";
import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { useAuthStore } from "../../common/stores/AuthStore";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import LoginAppBar from "../../common/components/LoginAppBar";
import MainContent from "./components/MainContent";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToastMessage();
  const navigate = useNavigate();

  return (
    <Flex minH="100vh" direction="column">
      <LoginAppBar isShowSearch={true} />
      <Flex
        mt={isMobile ? "50px" : "70px"}
        minH={isMobile ? "calc(100vh - 50px)" : "calc(100vh - 80px)"}
        direction={isMobile ? "column" : "row"}
      >
        <MainContent />
      </Flex>
    </Flex>
  );
};

export default MainPage;
