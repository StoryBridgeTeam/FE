import React from "react";
import { Flex, Box, useBreakpointValue } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../common/stores/AuthStore";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import { useNavigate } from "react-router-dom";

import LoginAppBar from "../../common/components/LoginAppBar";
import PolicyList from "./components/PolicyList";

const PolicyPage: React.FC = () => {
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
        mt={isMobile ? "50px" : "60px"}
        minH={isMobile ? "calc(100vh - 50px)" : "calc(100vh - 80px)"}
        bg="#E9E9E9"
      >
        <Box flex={1} />
        <Flex
          direction="column"
          width={{ base: "100%", md: "60%" }}
          bg="white"
          p={4}
        >
          <PolicyList />
        </Flex>
        <Box flex={1} />
      </Flex>
    </Flex>
  );
};

export default PolicyPage;
