import React, {useState} from "react";
import useProfileForm from "../hook/useProfileForm";
import {
    Avatar, Box,
    Button,
    Center, Divider,
    Flex,
    FormControl, HStack, IconButton,
    Input,
    Spinner, Table, TableContainer, Tbody, Td,
    Text, Th, Thead, Tr,
    useBreakpointValue, useToast,
    VStack
} from "@chakra-ui/react";
import EmailVerificationModal from "./EmailVertificationModal";
import useInvitationHook from "../hook/useInvitationHook";
import {ChevronLeftIcon, ChevronRightIcon, CopyIcon} from "@chakra-ui/icons";
import {getInvitationToken} from "../../../common/api/invitationAPI";
import {useToastMessage} from "../../../common/hooks/useToastMessage";
import {useAuthStore} from "../../../common/stores/AuthStore";
import dayjs from "dayjs";
import {useNavigate, useNavigation} from "react-router-dom";


const InvitationManage: React.FC = () => {
    const isMobile = useBreakpointValue({base: true, md: false});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {invitations, loading, pageInfo, fetchInvitation} = useInvitationHook();
    const navigate = useNavigate()

    const {nickName} = useAuthStore();
    const toast = useToast();

    const renderDate = (date: Date) => {
        const render = (n: number) => {
            return n.toString().length == 1 ? "0" + n.toString() : n.toString();
        }

        return `${date.getFullYear()}.${render(date.getMonth())}.${render(date.getDay())}
        ${render(date.getHours())}:${render(date.getMinutes())}:${render(date.getSeconds())}`;
    }

    const handleCopyCode = (code : string, type:string) => {
        try {
            const host = window.location.host;
            const linkWithToken = `${host}/${nickName}?token=${code}&type=${type}`;

            navigator.clipboard.writeText(linkWithToken);

            toast({
                title: "초대 링크가 복사되었습니다.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "초대 링크 복사에 실패했습니다.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }




    return (
        <Flex
            p={5}
            border={"1px solid #CDCDCD"}
            borderRadius={"30px"}
            // w={isMobile ? "350px" : "100"}
            width={"100%"}
            // height={"auto"}
            height={isMobile ? "auto " : "calc(100vh - 200px)"}
            ml={isMobile ? undefined : "30px"}
            direction={"column"}
            position={"relative"}
        >
            {
                loading &&
                <Center bgColor={"#dbdbdb"} left={0} top={0} borderRadius={"30px"} opacity={0.5} w={"100%"} h={"100%"}
                        position={"absolute"} zIndex={9999}>
                    <Spinner zIndex={9999}/>
                </Center>
            }
            <TableContainer overflowY={"auto"}>
                <Table variant={"striped"} colorScheme={"gray"}>
                    <Thead>
                        <Tr>
                            <Th textAlign={"center"} fontWeight={900}>번호</Th>
                            <Th textAlign={"center"} fontWeight={900}>코드</Th>
                            <Th textAlign={"center"} fontWeight={900}>생성일</Th>
                            <Th textAlign={"center"} fontWeight={900}>만료일</Th>
                            <Th textAlign={"center"} fontWeight={900}>타입</Th>
                            <Th textAlign={"center"} fontWeight={900}>댓글 작성유무</Th>
                            <Th textAlign={"center"} fontWeight={900}>가입여부</Th>
                            <Th textAlign={"center"} fontWeight={900}>가입회원</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            invitations.map((i, index) => (
                                <Tr>
                                    <Td textAlign={"center"}>{index + 1}</Td>
                                    <Td textAlign={"left"} >
                                        {i.code}
                                        <IconButton aria-label={"copy"} variant={"ghost"} onClick={() => handleCopyCode(i.code, i.type)}>
                                            <CopyIcon />
                                        </IconButton>
                                    </Td>
                                    <Td textAlign={"center"}>{dayjs(i.createdAt).format('YYYY.MM.DD HH:mm:ss').toString()}</Td>
                                    <Td textAlign={"center"}>{dayjs(i.expiredTime).format('YYYY.MM.DD HH:mm:ss').toString()}</Td>
                                    <Td textAlign={"center"} >{i.type=="NORMAL" ? "일반" : "읽기전용"}</Td>
                                    <Td textAlign={"center"}>{i.type=="NORMAL" ? i.isUsedComment ? "O" : "X" : "-"}</Td>
                                    <Td textAlign={"center"}>{i.type=="NORMAL" ? i.isJoined ? "O" : "X" : "-"}</Td>
                                    <Td textAlign={"center"}>{i.member ?
                                        <HStack cursor={"pointer"} _hover={{bgColor:"gray.200"}} p={2} borderRadius={5} onClick={() => navigate(`/${i.member?.nickname}`)}>
                                            <Avatar size={"xs"} src={`${process.env.REACT_APP_IMAGE_SERVER}/${i.member.profileImage}`} />
                                            <Text>{i.member.name}</Text>
                                        </HStack>
                                        : i.isJoined ? "알수없음" : "-"}</Td>
                                </Tr>
                            ))
                        }
                    </Tbody>
                </Table>
            </TableContainer>
            <HStack justifyContent={"center"} mt={4}>
                <HStack>
                    {
                        (5 * Math.floor(pageInfo.page / 5)) !== 0 &&
                        <Box px={3} py={2} border={"1px solid gray"} borderRadius={3}
                             fontWeight={"bold"}
                            // onClick={() => fetchInvitation( (5*(Math.ceil(pageInfo.page/5))),pageInfo.size)}
                             onClick={() => fetchInvitation((5 * (Math.floor(pageInfo.page / 5) - 1)), pageInfo.size)}
                             cursor={"pointer"}
                        >
                            <ChevronLeftIcon/>
                        </Box>
                    }
                    {
                        Array.from({length: pageInfo.totalPage > 5 ? 5 : pageInfo.totalPage})
                            .map((_, index) => (
                                <>
                                    {
                                        ((index + 1) + (5 * (Math.floor(pageInfo.page / 5)))) <= pageInfo.totalPage*pageInfo.size  &&
                                        <Box px={4} py={2} border={"1px solid gray"} borderRadius={3}
                                             bgColor={pageInfo.page + 1 === ((index + 1) + (5 * (Math.floor(pageInfo.page / 5)))) ? "black" : "white"}
                                             color={pageInfo.page + 1 === ((index + 1) + (5 * (Math.floor(pageInfo.page / 5)))) ? "white" : "black"}
                                             fontWeight={"bold"}
                                             onClick={() => fetchInvitation(((index + 1) + (5 * (Math.floor(pageInfo.page / 5)))) - 1, pageInfo.size)}
                                             cursor={"pointer"}
                                        >
                                            {(index + 1) + (5 * (Math.floor(pageInfo.page / 5)))}
                                        </Box>
                                    }
                                </>
                            ))
                    }
                    {
                        (Math.floor(pageInfo.page / 5)) !== Math.floor(pageInfo.totalPage/5) &&
                        <Box px={3} py={2} border={"1px solid gray"} borderRadius={3}
                             fontWeight={"bold"}
                             onClick={() => fetchInvitation((5 * (Math.floor(pageInfo.page / 5) + 1)), pageInfo.size)}
                             cursor={"pointer"}
                        >
                            <ChevronRightIcon/>
                        </Box>
                    }
                </HStack>
            </HStack>
        </Flex>
    );
};

export default InvitationManage;
