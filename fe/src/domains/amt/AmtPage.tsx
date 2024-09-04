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
        mt={isMobile ? "30px" : "60px"}
        minH={isMobile ? "calc(100vh - 50px)" : "calc(100vh - 60px)"}
        direction={isMobile ? "column-reverse" : "row"}
        justifyContent={"start"}
        paddingX={6}
      >
        <AmtTree />
        <NetWork />
      </Flex>
    </Flex>
  );
};

export default AmtPage;
