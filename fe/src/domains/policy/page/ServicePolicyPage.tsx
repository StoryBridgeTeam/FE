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

const ServicePolicyPage = () => {
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
                    <PolicyTab name={"이용약관"} path={"/policy/service"} isCurrent={true}/>
                    <PolicyTab name={"개인정보처리방침"} path={"/policy/privacy"}/>
                    <PolicyTab name={"결제정책"} path={"/policy/pay"}/>
                    <PolicyTab name={"환불정책"} path={"/policy/refund"}/>
                </PolicyTabs>
                <PolicyHeader title={"스토리브릿지 서비스 이용약관"} date={"2024년 10월 3일"} />
                <VStack w={"100%"} py={"20px"} gap={10}>
                    <PolicyContent title={"제1장 (목적)"} content={'본 약관은 사용자가 스토리브릿지 서비스(이하 "서비스"}를 이용함에 있어, 회사와 사용자 간의 권리, 의무, 책임사항 및 기타 필요한 사항을 규정함을 목적으로 합니다.'} />
                    <PolicyContent title={"제2조 (정의)"} content={'1.\t"서비스"란 회사가 제공하는 웹사이트 및 애플리케이션을 통해 제공되는 스토리브릿지 서비스를 의미합니다.\n' +
                        '2.\t"사용자"란 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.\n' +
                        '3.\t"회원"이란 서비스에 개인 정보를 제공하여 회원 등록을 완료한 자로서, 서비스의 정보를 지속적으로 제공받고 서비스를 계속적으로 이용할 수 있는 자를 의미합니다.\n' +
                        '4.\t"콘텐츠"란 사용자 또는 회사가 서비스 내에 게시 또는 전송하는 정보, 텍스트, 이미지, 동영상 등을 의미합니다.\n'} />
                    <PolicyContent title={"제3조 (이용약관의 효력 및 변경)"} content={'1.\t본 약관은 사용자가 서비스에 접속하거나 서비스를 이용함과 동시에 효력이 발생합니다.\n' +
                        '2.\t회사는 필요 시 약관을 변경할 수 있으며, 변경된 약관은 서비스 내에 게시하여 사용자에게 공지합니다. 변경된 약관은 게시일로부터 효력이 발생합니다.\n' +
                        '3.\t사용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.\n'} />
                    <PolicyContent title={'제4조 (회원가입 및 계정 관리)'} content={'1.\t사용자는 본 약관에 동의하고, 정해진 절차에 따라 회원가입을 신청할 수 있습니다.\n' +
                        '2.\t회원가입 시 제공된 정보는 정확해야 하며, 사용자는 항상 최신 정보로 유지할 책임이 있습니다.\n' +
                        '3.\t사용자의 계정 및 비밀번호에 대한 관리 책임은 사용자에게 있으며, 제3자가 이를 부정하게 사용하지 않도록 해야 합니다.\n'} />
                    <PolicyContent title={'제5조 (개인정보 보호'} content={'1.\t회사는 사용자의 개인정보를 보호하기 위해 관련 법령을 준수합니다.\n' +
                        '2.\t회사는 사용자의 동의 없이 개인정보를 제3자에게 제공하지 않으며, 개인정보 처리에 대한 자세한 사항은 회사의 개인정보처리방침에 따릅니다.\n'} />
                    <PolicyContent title={'제6조 (서비스 이용의 제한)'} content={'1.\t회사는 다음의 경우 사전 통보 없이 사용자의 서비스 이용을 제한하거나 계정을 정지할 수 있습니다:\n' +
                        'o\t법령 또는 본 약관을 위반한 경우\n' +
                        'o\t타인의 권리나 명예를 훼손하는 경우\n' +
                        'o\t서비스 운영을 방해하거나 불법적인 활동을 하는 경우\n' +
                        '2.\t회사는 서비스 운영상 또는 기술상의 필요에 따라 사전 고지 없이 서비스를 일시적으로 중단할 수 있습니다.\n'} />
                    <PolicyContent title={'제7조 (사용자의 의무)'} content={'1.\t사용자는 서비스를 불법적인 목적이나 방식으로 이용해서는 안 됩니다.\n' +
                        '2.\t사용자는 타인의 개인정보를 무단으로 수집, 저장, 공개하거나 침해해서는 안 됩니다.\n' +
                        '3.\t사용자는 회사가 제공하는 서비스를 통해 타인을 비방하거나 허위 사실을 유포하는 등의 불법적인 행위를 해서는 안 됩니다.\n'} />
                    <PolicyContent title={'제8조 (콘텐츠의 권리와 책임)'} content={'1.\t사용자가 서비스 내에 게시한 콘텐츠의 저작권은 사용자에게 귀속됩니다. 다만, 사용자는 서비스를 이용함에 있어 해당 콘텐츠가 서비스 내에서 사용될 수 있는 권리를 회사에 부여합니다.\n' +
                        '2.\t회사는 사용자가 게시한 콘텐츠가 법령을 위반하거나 타인의 권리를 침해할 경우, 이를 삭제하거나 수정할 수 있는 권한을 가집니다.\n'} />
                    <PolicyContent title={'제9조 (면책 조항)'} content={'1.\t회사는 사용자 간 또는 사용자와 제3자 간의 분쟁에 대해 개입하지 않으며, 이로 인해 발생하는 손해에 대해 책임을 지지 않습니다.\n' +
                        '2.\t회사는 기술적 문제나 네트워크 장애로 인한 서비스 중단, 데이터 손실 등에 대해 책임을 지지 않습니다.\n'} />
                    <PolicyContent title={'제10조 (약관의 해석 및 관할법원)'} content={'1.\t본 약관에 명시되지 않은 사항에 대해서는 관련 법령 또는 상관례에 따릅니다.\n' +
                        '2.\t서비스 이용으로 발생하는 모든 분쟁에 대해서는 회사의 본사 소재지 관할 법원을 제1심 관할법원으로 합니다.\n'} />
                </VStack>
            </VStack>
        </Container>
    </Flex>
}

export default ServicePolicyPage;