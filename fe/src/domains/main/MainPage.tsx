import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { useAuthStore } from "../login/stores/useAuthStore";
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
        isShowSearch={true}
      />
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
