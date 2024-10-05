
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
import LoginAppBar from "../../../common/components/LoginAppBar";
import {useNavigate} from "react-router-dom";
import {PolicyContent, PolicyHeader, PolicyTab, PolicyTabs} from "../components/PolicyComponents";

const RefundPolicyPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const contents = [
        {
            title:'1. 환불 신청',
            content: '•\t월 이용료 결제 후 7일 이내에 환불을 요청할 수 있습니다.\n' +
                '•\t환불 신청은 고객센터를 통해 접수해 주시기 바랍니다. 환불 요청 시에는 결제 내역 및 환불 사유를 함께 제출해야 합니다.\n'
        },
        {
            title: '2. 환불 가능 사유',
            content: '•\t서비스 장애 또는 기술적 문제로 인해 서비스가 정상적으로 제공되지 않은 경우\n' +
                '•\t결제 후 7일 이내에 서비스가 사용자에게 제공되지 않은 경우\n' +
                '•\t회사의 귀책 사유로 인해 정상적인 서비스 이용이 불가능한 경우\n'
        },
        {
            title: '3. 환불 불가 사유',
            content: '•\t월 이용료 결제 후 7일이 경과한 경우\n' +
                '•\t회원 전용서비스 또는 콘텐츠를 이미 이용하거나 다운로드한 경우\n' +
                '•\t사용자의 귀책 사유로 서비스 이용에 차질이 발생한 경우\n'
        },
        {
            title: '4. 환불 처리 절차',
            content: '•\t환불 신청이 접수되면, 회사는 환불 사유를 검토하고 환불 승인 여부를 결정합니다. 승인된 환불은 결제일로부터 7일 이내에 처리됩니다.\n' +
                '•\t환불은 원칙적으로 결제에 사용된 수단을 통해 처리됩니다. 신용카드, 간편결제, 계좌이체 등 결제 수단에 따라 환불 처리 시간이 다를 수 있습니다.\n'
        },
        {
            title: '5. 부분 환불',
            content: '•\t월 이용료 결제 후 7일 이내에 환불을 요청하였으나, 일부 서비스를 이미 이용한 경우 해당 기간에 해당하는 금액을 차감한 후 부분 환불이 이루어질 수 있습니다.'
        },
        {
            title: '6. 기타 사항',
            content: '•\t서비스 중단이나 변경, 불가피한 시스템 점검 등의 사유로 서비스가 일시적으로 중단될 경우 환불 대상이 되지 않습니다.\n' +
                '•\t본 환불 정책은 관련 법령 및 회사의 약관에 따르며, 필요한 경우 정책은 변경될 수 있습니다. 변경 사항은 서비스 내 공지사항을 통해 안내됩니다.\n'
        }
    ]

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
                    <PolicyTab name={"결제정책"} path={"/policy/pay"}/>
                    <PolicyTab name={"환불정책"} path={"/policy/refund"} isCurrent={true}/>
                </PolicyTabs>
                <PolicyHeader title={"환불정책 안내 (월 이용료 결제 관련)"} date={"2024년 10월 3일"} />
                <PolicyContent title={""} content={'스토리브릿지 서비스를 이용해 주셔서 감사합니다.\n 서비스 이용 중 불편사항이 발생하였을 경우, 아래의 환불 정책을 참고해 주시기 바랍니다.'} />
                <VStack w={"100%"} py={"20px"} gap={10}>
                    {
                        contents.map(c => (
                            <PolicyContent title={c.title} content={c.content} />
                        ))
                    }
                </VStack>
            </VStack>
        </Container>
    </Flex>
}

export default RefundPolicyPage;