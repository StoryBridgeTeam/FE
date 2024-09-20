import React from "react";
import {Box, Center, Divider, Flex, Heading, VStack} from "@chakra-ui/react";
import LoginAppBar from "../components/LoginAppBar";

const PayPolicyPage = () => {
    return <Box>
        <LoginAppBar />
        <Center  w={"100%"} h={"100vh"}>
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
        </Center>
    </Box>
}

export default PayPolicyPage;