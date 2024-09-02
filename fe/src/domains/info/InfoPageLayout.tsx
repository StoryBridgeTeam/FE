import {Box, Flex, useBreakpointValue} from "@chakra-ui/react";
import LoginAppBar from "../../common/components/LoginAppBar";
import { useAuthStore } from "../../common/stores/AuthStore";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import {FC, JSX, useState} from "react";
import MainContent from "./components/MainContent";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "./components/ProfileSideBar";

interface InfoPageLayoutProps{
    nickname : string,
    children : React.ReactNode
}

const InfoPageLayout = ({nickname, children}:InfoPageLayoutProps) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToastMessage();
  const navigate = useNavigate();

  return (
    <Flex minH="100vh" direction="column">
      <LoginAppBar
        field1="header.mypage"
        field1OnClick={() => {
          navigate("/mypage");
        }}
        field2="header.logout"
        field2OnClick={() => {
          logout();
          showToast(
            "logout.successTitle",
            "logout.successDescription",
            "success"
          );
        }}
      />
      <Flex
        mt={isMobile ? "50px" : "60px"}
        minH={isMobile ? "calc(100vh - 50px)" : "calc(100vh - 60px)"}
        direction={isMobile ? "column" : "row"}
      >
          {isMobile ? undefined : <ProfileSidebar nickname={nickname} />}
          <Box w={"100%"}>
              {children}
          </Box>
      </Flex>
    </Flex>
  );
};

export default InfoPageLayout;
