import {
    Box,
    Heading,
    Spinner,
    useBreakpointValue,
    VStack,
    Text,
    Flex,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useCard} from "../hooks/useCard";
import {EntryState} from "../types/cardTypes";
import CardInfoBox from "./CardInfoBox";
import SelfIntroductionBox from "./SelfIntoductionBox";
import {Share} from "tabler-icons-react";
import InviteModal from "../../../common/components/InviteModal";

//명함카드 영역 컴포넌트
const CardComponent: React.FC = () => {
    const isMobile = useBreakpointValue({base: true, md: false});
    const {nickName=""} = useParams<{ nickName: string }>();
    const {loading, error, checkCard, fetchPublicCard} = useCard({nickname:nickName});
    const [hasCard, setHasCard] = useState<boolean>(false);
    const [briefEntries, setBriefEntries] = useState<EntryState[]>([]);
    const savedNickName = localStorage.getItem("nickName");
    const isHost = nickName === savedNickName;
    const [name, setName] = useState<string>("");
    const [cardId, setCardId] = useState<number | null>(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const navigate = useNavigate();
    const {
        isOpen: isInviteModalOpen,
        onOpen: onInviteModalOpen,
        onClose: onInviteModalClose,
    } = useDisclosure();

    useEffect(() => {
        if (nickName) {
            if (token) {
                checkCard(nickName, token).then((result) => {
                    if (result) {
                        setHasCard(true);
                        fetchPublicCard(nickName, "BRIEF", token).then((data) => {
                            setBriefEntries(data.entries);
                            setName(data.name);
                            setCardId(data.id);
                        });
                    } else {
                        setHasCard(false);
                    }
                });
            } else {
                checkCard(nickName).then((result) => {
                    if (result) {
                        setHasCard(true);
                        fetchPublicCard(nickName, "BRIEF").then((data) => {
                            setBriefEntries(data.entries);
                            setName(data.name);
                            setCardId(data.id);
                        });
                    } else {
                        setHasCard(false);
                    }
                });
            }
        }
    }, [nickName, token]);

    const handleClick = () => {
        const url = `/${nickName}/card`;
        const searchParams = new URLSearchParams();

        if (token) {
            searchParams.append("token", token);
        }

        navigate(`${url}?${searchParams.toString()}`);
    };

    if (loading) {
        return <Spinner/>;
    }

    if (error) {
        return <Text color="red.500">{error}</Text>;
    }

    return (
        <VStack
            bg="#F6F6F6"
            borderRadius="3xl"
            h="100%"
            w="100%"
            overflow="hidden"
            p={5}
            color="#CDCDCD"
            border={isMobile ? "none" : "1px solid"}
            spacing={5}
            minWidth={"300px"}
        >
            <Box
                w={"100%"} bg={"white"}
                 height={"auto"} borderRadius={"3xl"} shadow={"md"}
                 p={4} boxSizing={"border-box"}
            >
                <VStack align="stretch" spacing={2} color="black" flex={1} h={"100%"}>
                    {hasCard && (
                        <Flex alignItems="center" justifyContent="space-between">
                            <Box flex="1"/>
                            <Heading
                                fontSize={isMobile ? "md" : "xl"}
                                textAlign="center"
                                flex="2"
                            >
                                {name}
                            </Heading>
                            <Box flex="1" textAlign="right">
                                {isHost && (
                                    <Button size="sm" bg="white" onClick={onInviteModalOpen}>
                                        <Share size={20} color="black"/>
                                    </Button>
                                )}
                            </Box>
                        </Flex>
                    )}
                    <CardInfoBox
                        briefEntries={briefEntries}
                        onClick={handleClick}
                        hasCard={hasCard}
                    />
                </VStack>
            </Box>
            <SelfIntroductionBox/>
            {
                isInviteModalOpen &&
                <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose}/>
            }
        </VStack>
    );
};

export default CardComponent;
