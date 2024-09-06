import {
    Avatar,
    Box,
    Button,
    Center,
    Flex,
    Heading,
    HStack, Radio, RadioGroup,
    Stat, StatHelpText, StatNumber,
    Text,
    useBreakpointValue,
    VStack
} from "@chakra-ui/react";
import {KaKaoLoginButton} from "../../login/components/SocailLogin";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {fetchMySelectAccounts, linkMySelectAccounts} from "../api/oauthAPI";
import {useToastMessage} from "../../../common/hooks/useToastMessage";

const  OauthSelectAccountPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const navigate = useNavigate();

    const {showToast} = useToastMessage();

    const { t } = useTranslation();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token") || "";
    const oid = queryParams.get("oid")||"";
    const otoken = queryParams.get("otoken")||"";

    const [select, setSelect] = useState("");
    const [myaccounts, setMyAccounts] = useState<{
        id:number,
        loginId:string,
        joinedAt:string
    }[]>([]);

    useEffect(() => {
        fetchMyAccounts();
    }, []);

    const fetchMyAccounts = async () => {
        const data =  await fetchMySelectAccounts(Number(oid), otoken);
        setMyAccounts(data);
    }

    const handleLinkAccount = async () => {
        if(select=="") return;

        const curAcc = myaccounts[Number(select)];

        await linkMySelectAccounts(Number(oid), otoken, curAcc.id);
        showToast("계정 연결 완료", "계정연결을 완료했습니다.", "success");
        navigate("/");
    }

    return <Flex minH="100vh" align="center" justify="center" direction="column"
    >
        <VStack
            bg="white"
            py={8}
            px={10}
            // shadow={isMobile ? undefined : "xl"}
            border={isMobile ? undefined : "1px"}
            borderColor={isMobile ? undefined : "#CDCDCD"}
            maxW="lg"
            w="full"
            borderRadius="3xl"
            justifyContent={"center"}
        >
            <Heading size={"md"} mb={3}>연결할 계정 선택</Heading>
                <RadioGroup w={"100%"} value={select}>
                    <VStack w={"100%"} border={"0.3px solid #CDCDCD"} borderRadius={"3xl"} padding={4} gap={2}>
                        {
                            myaccounts.map((a, idx) =>
                                <HStack padding={1} borderRadius={"xl"} gap={4} w={"100%"} justifyContent={"space-around"} onClick={() => setSelect('0')} _hover={{cursor:"pointer", bgColor:"gray.200"}}>
                                    <Stat >
                                        <StatNumber fontSize={16}>{a.loginId}</StatNumber>
                                        <StatHelpText fontSize={10}>
                                            가입일 : {a.joinedAt}
                                        </StatHelpText>
                                    </Stat>
                                    <Radio value={String(idx)} />
                                </HStack>
                            )
                        }
                    </VStack>
                </RadioGroup>
            <Button w={"100%"} mt={4} isDisabled={select==""} onClick={handleLinkAccount}>연결하기</Button>
        </VStack>
    </Flex>
}

export default OauthSelectAccountPage;