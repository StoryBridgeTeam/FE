import { Flex, useBreakpointValue } from "@chakra-ui/react";
import LoginAppBar from "../../../common/components/LoginAppBar";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import DetailContent from "./DetailContent";
import { useAuthStore } from "../../../common/stores/AuthStore";

const DetailPage: FC = () => {
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
        <DetailContent />
      </Flex>
    </Flex>
  );
};

export default DetailPage;
