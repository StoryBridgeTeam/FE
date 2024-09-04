import {Box, Button, Container, Flex, Heading, Spinner, Text, useDisclosure, VStack} from "@chakra-ui/react";
import InfoPageLayout from "../InfoPageLayout";
import {Check, Edit, Link} from "tabler-icons-react";
import InviteModal from "../../../common/components/InviteModal";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useProfileStore} from "../Store/useProfileStore";
import {useTranslation} from "react-i18next";
import {getCoverLetters} from "../api/InfoAPI";
import TextSection from "../components/TextSection";

interface MockData {
    id: number;
    title: string;
    content: string;
}

const InfoMainPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const navigate = useNavigate();

    const { nickName="" } = useParams<{ nickName: string }>();
    const name = localStorage.getItem("nickName");
    const ishost = nickName === name;

    const { t } = useTranslation();

    const [isLoading, setLoading] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [mockData, setMockData] = useState<MockData[]>([]);

    const fetchCoverData = async () => {
        try {
            setLoading(true);
            let entries;

            if (token) {
                const response = await getCoverLetters(nickName!, token);
                entries = response.entries;
            } else {
                const response = await getCoverLetters(nickName!);
                entries = response.entries;
            }

            if (entries.content === null) {
                setMockData([]);
            } else {
                setMockData(entries.content);
            }
        } catch (error) {
            console.error("cover error:", error);
            setMockData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoverData();
    }, []);

    const handleEditClick = () => {
        const searchParams = new URLSearchParams();

        if (token) {
            searchParams.append("token", token);
        }

        navigate(`/info/create?${searchParams}`)
    }

    return <InfoPageLayout nickname={nickName}>
        <Container maxW="3xl" paddingX={10} paddingY={5}>
            {isLoading ? (
                <Flex justifyContent="center" alignItems="center" h="100vh">
                    <Spinner />
                </Flex>
            ) : (
                <>
                    <Flex direction={"row"} justifyContent="space-between" alignItems={"center"}>
                        <Box textAlign={"left"}>
                            <Heading size="md" >{t(`info.info`)}</Heading>
                        </Box>
                        {ishost && (
                            <Flex
                                justifyContent="flex-end"
                                alignItems="center"
                            >
                                <Button onClick={handleEditClick} mr={2} size={"sm"}>
                                    <Edit size={16} color="black" />
                                </Button>
                                <Button
                                    leftIcon={<Link size={16} />}
                                    onClick={onOpen} fontSize={14} size={"sm"}>
                                    초대링크
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                    <Flex justifyContent="center">
                        {mockData.length === 0 && !isLoading && (
                            <Text>{t(`info.noInfo`)}</Text>
                        )}
                    </Flex>
                    <VStack gap={4} mt={3}>
                        {mockData.map((data) => (
                            <TextSection
                                key={data.id}
                                id={data.id}
                                title={data.title}
                                content={data.content}
                                onClick={() => token ? navigate(`/${nickName}/info/${data.id}?token=${token}`) : navigate(`/${nickName}/info/${data.id}`)}
                            />
                        ))}
                    </VStack>
                </>
            )}
        </Container>
        <InviteModal isOpen={isOpen} onClose={onClose} />
    </InfoPageLayout>;
}

export default InfoMainPage;
