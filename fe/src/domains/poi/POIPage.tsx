import React from "react";
import { Flex, Box, useBreakpointValue } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../common/stores/AuthStore";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import { useNavigate } from "react-router-dom";

import LoginAppBar from "../../common/components/LoginAppBar";
import POICreate from "./components/POICreate";
import POIView from "./components/POIView";
import POIModify from "./components/POIModify";

const POIPage: React.FC = () => {
  const { poiId } = useParams<{ poiId: string }>(); // URL에서 poiId를 가져오기
  const isCreateMode = !poiId;
  const isModifyMode = poiId && window.location.pathname.endsWith("/modify");

  const isMobile = useBreakpointValue({ base: true, md: false });
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToastMessage();
  const navigate = useNavigate();

  return (
    <Flex minH="100vh" direction="column">
      <LoginAppBar isShowSearch={true} />
      <Flex
        mt={isMobile ? "50px" : "60px"}
        minH={isMobile ? "calc(100vh - 50px)" : "calc(100vh - 80px)"}
        bg="#E9E9E9"
      >
        <Box flex={1} />
        <Flex
          direction="column"
          // width={{ base: "100%", md: "60%" }}
            w={"100%"}
          bg="white"
          p={4}
        >
          {isCreateMode ? (
            <POICreate />
          ) : isModifyMode ? (
            <POIModify poiId={poiId} />
          ) : (
            <POIView poiId={poiId} />
          )}
        </Flex>
        <Box flex={1} />
      </Flex>
    </Flex>
  );
};

export default POIPage;
