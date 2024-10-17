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

const PrivacyPolicyPage = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });

    const contents = [
        {
            title:'제1조 (개인정보의 수집 항목)',
            content:'회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다:\n' +
                '1.\t필수 수집 항목\n' +
                'o\t회원가입 시: 이름, 이메일 주소, 비밀번호, 연락처 정보, 성별, 생년월일\n' +
                'o\t프로필 정보: 직업, 학력, 경력, 자기소개, 프로필 사진\n' +
                'o\t서비스 이용 기록: 접속 로그, IP 주소, 쿠키, 기기 정보\n' +
                '2.\t선택적 수집 항목\n' +
                'o\t스토리브릿지 연결 시: 타 서비스와 연동되는 계정 정보 (예: 구글 또는 네이버)\n' +
                'o\t게시물, 댓글, 좋아요 등의 사용자가 생성한 콘텐츠\n'
        },
        {
            title:'제2조 (개인정보의 수집 방법)',
            content: '회사는 다음과 같은 방법으로 개인정보를 수집합니다:\n' +
                '1.\t사용자가 직접 제공하는 정보(회원가입, 서비스 이용 과정에서 입력하는 정보)\n' +
                '2.\t자동으로 수집되는 정보(쿠키, IP 주소, 브라우징 기록 등)\n' +
                '3.\t제3자로부터 제공받는 정보(스토리브릿지 연동 시, 다른 플랫폼에서 수집되는 정보)\n',
        },
        {
            title:'제3조 (개인정보의 수집 및 이용 목적)',
            content: '회사는 수집된 개인정보를 다음과 같은 목적을 위해 이용합니다:\n' +
                '1.\t서비스 제공 및 운영: 회원 관리, 사용자 인증, 맞춤형 서비스 제공\n' +
                '2.\t커뮤니케이션: 공지사항 전달, 고객 지원 및 상담\n' +
                '3.\t마케팅 및 광고: 사용자 관심사에 맞춘 콘텐츠 제공 및 마케팅 활용\n' +
                '4.\t서비스 개선 및 분석: 사용자 피드백 수집, 서비스 개선을 위한 통계 분석\n' +
                '5.\t법적 의무 준수: 법령에서 요구하는 자료 보관 및 법적 분쟁 대응\n',
        },
        {
            title:'제4조 (개인정보의 보유 및 이용 기간)',
            content: '회사는 법령에 따른 보관 의무가 있는 경우를 제외하고, 사용자가 서비스 이용을 중단하거나 회원 탈퇴 시 수집된 개인정보를 지체 없이 파기합니다.\n' +
                '1.\t회원정보: 회원 탈퇴 시까지 보유\n' +
                '2.\t로그 및 분석 정보: 수집 후 6개월 동안 보관 후 삭제\n' +
                '3.\t법적 필요 정보: 관련 법령에서 정한 기간 동안 보관 (예: 전자상거래법에 따른 거래 기록 5년 보관)\n',
        },
        {
            title:'제5조 (개인정보의 제3자 제공)',
            content: '회사는 사용자의 동의 없이는 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음과 같은 경우는 예외로 합니다:\n' +
                '1.\t법령에 따라 권한 있는 기관이 요청한 경우\n' +
                '2.\t사용자의 명시적 동의를 받은 경우\n' +
                '3.\t서비스 제공을 위해 필수적인 외부 업체와의 정보 공유 (예: 결제 대행사)\n',
        },
        {
            title:'제6조 (개인정보 처리 위탁)',
            content: '회사는 서비스 제공을 위해 일부 개인정보 처리를 외부 업체에 위탁할 수 있습니다. 위탁 업체가 개인정보 보호를 충분히 보장할 수 있도록 필요한 절차를 마련하며, 위탁 업체는 계약을 통해 개인정보 보호의무를 성실히 이행합니다.',
        },
        {
            title:'제7조 (사용자의 권리와 행사 방법)',
            content: '사용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:\n' +
                '1.\t개인정보 조회 및 수정 요청\n' +
                '2.\t개인정보 삭제 요청\n' +
                '3.\t개인정보 처리 제한 요청\n' +
                '4.\t개인정보 이동 요청\n' +
                '요청은 서비스 내 설정 기능 또는 고객 지원을 통해 제출할 수 있으며, 회사는 관련 법령에 따라 지체 없이 처리합니다.\n',
        },
        {
            title:'제8조 (개인정보의 보호 조치)',
            content: '회사는 사용자의 개인정보를 안전하게 보호하기 위해 다음과 같은 기술적, 관리적, 물리적 조치를 취합니다:\n' +
                '1.\t암호화: 사용자의 개인정보는 암호화되어 저장 및 전송됩니다.\n' +
                '2.\t접근 통제: 개인정보에 접근할 수 있는 자를 최소한으로 제한하고, 권한을 철저히 관리합니다.\n' +
                '3.\t보안 시스템: 해킹 및 외부 침입을 방지하기 위한 보안 시스템 및 모니터링 시스템을 운영합니다.\n',
        },
        {
            title:'제9조 (쿠키의 사용)',
            content: '회사는 서비스를 개선하고, 사용자에게 맞춤형 서비스를 제공하기 위해 쿠키를 사용합니다. 사용자는 브라우저 설정을 통해 쿠키 사용을 거부할 수 있으나, 이 경우 서비스 이용에 제한이 있을 수 있습니다.',
        },
        {
            title:'제10조 (개인정보 보호책임자 및 문의처)',
            content: '회사는 개인정보 보호를 위해 다음과 같은 개인정보 보호책임자를 지정하고 있습니다. 사용자는 개인정보와 관련한 문의 및 불만 사항을 언제든지 문의할 수 있습니다.\n' +
                '•\t개인정보 보호책임자: 정유철\n' +
                '•\t이메일: enthusia77@naver.com\n' +
                '•\t연락처: 054-604-4000\n' +
                '회사는 사용자의 개인정보 침해와 관련된 신고가 접수되는 즉시 신속하고 충분한 답변을 드릴 것을 약속드립니다.\n',
        },
        {
            title:'제11조 (개인정보 처리방침의 변경)',
            content: '본 방침은 법령 또는 회사 정책에 따라 변경될 수 있으며, 변경 사항은 서비스 내 공지사항을 통해 사전 고지됩니다. 변경된 방침은 공지된 날부터 효력이 발생합니다.',
        },
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
                    <PolicyTab name={"개인정보처리방침"} path={"/policy/privacy"} isCurrent={true}/>
                    <PolicyTab name={"결제정책"} path={"/policy/pay"}/>
                    <PolicyTab name={"환불정책"} path={"/policy/refund"}/>
                </PolicyTabs>
                <PolicyHeader title={"스토리브릿지 서비스 개인정보 처리방침"} date={"2024년 9월 20일"} />
                <PolicyContent title={""} content={'본 개인정보 처리방침(이하 "방침")은 스토리브릿지 서비스(이하 "서비스")에서 사용자의 개인정보를 어떻게 수집, 사용, 공유 및 보호하는지에 대해 설명합니다. \n 본 방침은 서비스 이용과 관련한 모든 사용자에게 적용됩니다.'} />
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

export default PrivacyPolicyPage;