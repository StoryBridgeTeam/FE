import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import LoginAppBar from "../../common/components/LoginAppBar";
import { useAuthStore } from "../login/stores/useAuthStore";
import { useTranslation } from "react-i18next";
import { useToastMessage } from "../../common/hooks/useToastMessage";
function InfoPage() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToastMessage();
  const { t } = useTranslation();
  return (
    <Flex minH="100vh" align="center" direction="column">
      <LoginAppBar
        field1="header.mypage"
        field2="header.logout"
        field2OnClick={() => {
          logout();
          showToast("logout.successTitle", "logout.successDescription", "success");
        }}
      />
      <Box
        w="1120px"
        h="999px"
        border="1px"
        borderTop="0px"
        borderColor="#CDCDCD"
      >
        <Flex h="500px" border="1px" borderColor={"red"}>
          sdfsd
        </Flex>
      </Box>
    </Flex>
  );
}
export default InfoPage;
