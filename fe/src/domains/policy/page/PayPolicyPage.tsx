import React from "react";
import {
    Box,
    Center,
    Container,
    Divider,
    Flex,
    Heading,
    HStack,
    Spinner, Text,
    useBreakpointValue,
    VStack
} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import LoginAppBar from "../../../common/components/LoginAppBar";
import {PolicyHeader, PolicyTab, PolicyTabs} from "../components/PolicyComponents";

const PayPolicyPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    return <Flex h="100vh" direction="column" w={"100%"}>
        <LoginAppBar />
        <Container
            w={"100%"}
            maxW={"1400px"}
            h={"calc(100vh - 60px)"}
            mt={isMobile ? "50px" : "60px"}
            py={5}
            px={0}
        >
            <VStack gap={10} px={10}>
                <PolicyTabs >
                    <PolicyTab name={"이용약관"} path={"/policy/service"}/>
                    <PolicyTab name={"개인정보처리방침"} path={"/policy/privacy"}/>
                    <PolicyTab name={"결제정책"} path={"/policy/pay"} isCurrent={true}/>
                    <PolicyTab name={"환불정책"} path={"/policy/refund"}/>
                </PolicyTabs>
                <PolicyHeader title={"스토리브릿지 서비스 결제정책"} date={"2024년 10월 3일"} />
                <Center w={"100%"} maxW={"1400px"} h="100%">
                    <VStack border={"1px solid gray"} borderRadius={10} w={"500px"} p={10}>
                        <Heading size={"lg"} mb={5}>월 회원권</Heading>
                        <VStack border={"1px solid gray"} borderRadius={10} w={"100%"} p={5} gap={3}>
                            <Heading size={"lg"} w={"100%"} textAlign={"right"}>월 1만원</Heading>
                            <Divider />
                            <Heading size={"lg"} w={"100%"} textAlign={"center"}>혜택</Heading>
                            <Heading size={"md"} w={"100%"} textAlign={"left"}>채팅무제한이용</Heading>
                        </VStack>
                    </VStack>
                </Center>
            </VStack>
        </Container>
    </Flex>
}
export default PayPolicyPage;