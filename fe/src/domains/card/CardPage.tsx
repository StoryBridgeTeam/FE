import React, { useEffect } from "react";
import { Flex, Box, useBreakpointValue } from "@chakra-ui/react";
import { useLocation, useParams } from "react-router-dom";
import { useAuthStore } from "../../common/stores/AuthStore";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import { useNavigate } from "react-router-dom";
import CardModalComponent from "./components/CardModalComponent";
import LoginAppBar from "../../common/components/LoginAppBar";
import { useCard } from "./hooks/useCard";
import CommentList from "./components/CommentList";
import FirstCardModal from "./components/FirstCardModal";

const CardPage: React.FC = () => {
  const { nickName } = useParams<{ nickName: string }>();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logout = useAuthStore((state) => state.logout);
  const { showToast } = useToastMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const { name, cardId, hasCard } = location.state || {};
  console.log("location.state:", location.state);
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

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
        {hasCard ? null : <Box flex={1} />}
        <Flex
          direction="column"
          width={{ base: "100%", md: hasCard ? "70%" : "60%" }}
          bg="white"
          p={4}
        >
          {hasCard ? (
            <CardModalComponent
              name={name}
              nickName={nickName!}
              cardId={cardId}
            />
          ) : (
            <FirstCardModal nickName={nickName!} />
          )}
        </Flex>
        {/* <Box flex={1} /> */}
        <Box flex={1}>
          {hasCard ? (
            <CommentList nickName={nickName!} cardId={cardId} />
          ) : null}
        </Box>
      </Flex>
    </Flex>
  );
};

export default CardPage;
