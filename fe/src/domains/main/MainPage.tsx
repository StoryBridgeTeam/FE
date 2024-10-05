import React from "react";
import {
    Box,
    Breadcrumb,
    BreadcrumbItem,
    Center,
    Divider,
    Flex,
    Heading,
    HStack, Link,
    useBreakpointValue, VStack
} from "@chakra-ui/react";
import { useAuthStore } from "../../common/stores/AuthStore";
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
      <LoginAppBar isShowSearch={true} />
      <Flex
        mt={isMobile ? "50px" : "70px"}
        // mb={isMobile ? "100px" : "200px"}
        minH={isMobile ? "calc(100vh - 230px)" : "calc(100vh - 240px)"}
        direction={isMobile ? "column" : "row"}
      >
        <MainContent />
      </Flex>
        <Box
            height={isMobile ? "auto" : "180px"}
            w={"100%"}
            bg={"#F6F6F6"}
            borderTop={"1px solid #dbdbdb"}
        >
            <Box
                // h={"100%"}
                w={"100%"}
                maxW={"1400px"}
                m={"0 auto"}
                // bgColor={"red"}
            >
                <HStack w={"100%"} h={"100%"} p={5} gap={10} >
                    <Center w={"250px"} h={"100%"}>
                        <Heading color={"gray.500"}>StoryBridge</Heading>
                    </Center>
                    <VStack w={"100%"}>
                        <HStack w={"100%"} flexWrap={"wrap"}>
                            <Heading size={"sm"} color={"gray.500"} cursor={"pointer"} onClick={() => navigate("/policy/service")}>이용약관</Heading>
                            <Heading size={"md"} color={"gray.500"} >|</Heading>
                            <Heading size={"sm"} color={"gray.500"}  cursor={"pointer"} onClick={() => navigate("/policy/privacy")}>개인정보처리방침</Heading>
                            <Heading size={"md"} color={"gray.500"}>|</Heading>
                            <Heading size={"sm"} color={"gray.500"}  cursor={"pointer"} onClick={() => navigate("/policy/pay")}>결제정책</Heading>
                            <Heading size={"md"} color={"gray.500"}>|</Heading>
                            <Heading size={"sm"} color={"gray.500"}  cursor={"pointer"} onClick={() => navigate("/policy/refund")}>환불정책</Heading>
                        </HStack>
                        <HStack w={"100%"} flexWrap={"wrap"}>
                            <Heading size={"sm"} color={"gray.500"}>법인명 주식회사 퀘스트마인드(QuestMind Inc.)</Heading>
                            <Heading size={"md"} color={"gray.500"}>|</Heading>
                            <Heading size={"sm"} color={"gray.500"}>주소 경상북도 구미시 대학로 61, 국제교육관 413호(양호동, 금오공과대학교)</Heading>
                            <Heading size={"md"} color={"gray.500"}>|</Heading>
                            <Heading size={"sm"} color={"gray.500"}>대표자 정유철</Heading>
                            <Heading size={"md"} color={"gray.500"}>|</Heading>
                            <Heading size={"sm"} color={"gray.500"}>사업자등록번호 703-81-03051</Heading>
                            <Heading size={"md"} color={"gray.500"}>|</Heading>
                            <Heading size={"sm"} color={"gray.500"}>대표번호 054-604-4000</Heading>
                        </HStack>
                    </VStack>
                </HStack>
            </Box>

        </Box>
    </Flex>
  );
};

export default MainPage;
