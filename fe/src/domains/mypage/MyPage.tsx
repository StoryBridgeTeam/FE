import { Flex, useBreakpointValue } from "@chakra-ui/react";
import { FC } from "react";
import LoginAppBar from "../../common/components/LoginAppBar";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import { useAuthStore } from "../../common/stores/AuthStore";
import DynamicForm from "./components/DynamicForm";

const MyPage: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { showToast } = useToastMessage();
  const logout = useAuthStore((state) => state.logout);

  return (
    <Flex minH="100vh" direction="column">
      <LoginAppBar
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
        <DynamicForm />
      </Flex>
    </Flex>
  );
};

export default MyPage;
