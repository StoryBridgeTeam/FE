import { Flex, useBreakpointValue } from "@chakra-ui/react";
import LoginAppBar from "../../common/components/LoginAppBar";
import { useAuthStore } from "../login/stores/useAuthStore";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import { FC } from "react";
import MainContent from "./components/MainContent";
import ProfileSidebar from "./components/ProfileSideBar";
const InfoPage: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToastMessage();

  return (
    <Flex minH="100vh" direction="column">
      <LoginAppBar
        field1="header.mypage"
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
        
        <MainContent />
      </Flex>
    </Flex>
  );
};

export default InfoPage;
