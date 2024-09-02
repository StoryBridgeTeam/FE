import {Box, Button, Container, Flex, Heading, Spinner, Text, useDisclosure} from "@chakra-ui/react";
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
        navigate(`/info/create`)
    }

    return <InfoPageLayout nickname={nickName}>
        <Container maxW="4xl">
            {isLoading ? (
                <Flex justifyContent="center" alignItems="center" h="100vh">
                    <Spinner />
                </Flex>
            ) : (
                <>
                    {ishost && (
                        <Flex
                            w="full"
                            justifyContent="flex-end"
                            alignItems="center"
                            mt={5}
                        >
                            <Button onClick={handleEditClick} mr={2}>
                                <Edit size={24} color="black" />
                            </Button>
                            <Button onClick={onOpen}>
                                <Link />
                                초대링크
                            </Button>
                        </Flex>
                    )}
                    <Flex justifyContent="center" mb={5} mt={12}>
                        <Heading size="lg">{t(`info.info`)}</Heading>
                    </Flex>
                    <Flex justifyContent="center">
                        {mockData.length === 0 && !isLoading && (
                            <Text>{t(`info.noInfo`)}</Text>
                        )}
                    </Flex>
                    {mockData.map((data) => (
                      <TextSection
                        key={data.id}
                        id={data.id}
                        title={data.title}
                        content={data.content}
                        // isEditing={isEdit}
                        onClick={() => {}}
                        // onDelete={handleDelete}
                      />
                    ))}
                    {/*{isEdit ? (*/}
                    {/*  <Flex justifyContent="center" mt={3} mb={8}>*/}
                    {/*    <Button onClick={handleAddNewClick}>{t(`info.add_new`)}</Button>*/}
                    {/*  </Flex>*/}
                    {/*) : undefined}*/}
                </>
            )}
        </Container>
        <InviteModal isOpen={isOpen} onClose={onClose} />
    </InfoPageLayout>;
}

export default InfoMainPage;
