import {
  Container,
  Button,
  Heading,
  Flex,
  useBreakpointValue,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { Edit, Check } from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import TextSection from "./TextSection";
import ProfileSidebar from "./ProfileSideBar";
import { useProfileStore } from "../Store/useProfileStore";
import {
  deleteCoverLetters,
  getCoverLetters,
  postCoverLetters,
} from "../api/InfoAPI";
import { useCommentStore } from "../Store/CommentStore";
import { getComments } from "../api/CommentAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import InviteModal from "../../../common/components/InviteModal";

interface MockData {
  id: number;
  title: string;
  content: string;
}

const MainContent: FC = () => {
  const { nickName } = useParams<{ nickName: string }>();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [mockData, setMockData] = useState<MockData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { t } = useTranslation();
  const { isEdit, setEdit } = useProfileStore();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { setComments } = useCommentStore();
  const name = localStorage.getItem("nickName");
  const ishost = nickName === name;
  const navigte = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

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
  }, [nickName]);

  const handleSectionClick = async (id: number) => {
    try {
      const response = await getComments(id, 0);
      if (response) {
        setComments(response);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("comment error:", error);
    }

    setSelectedId(id);
    navigte(`/${nickName}/info/${id}`);
  };

  const handleEditClick = () => {
    setEdit(!isEdit);
  };

  const handleSaveClick = () => {
    setEdit(false);
  };

  const handleDelete = async (id: number) => {
    await deleteCoverLetters(nickName!, id);
    await fetchCoverData();
  };

  const handleAddNewClick = async () => {
    const newMockData = {
      title: t(`info.newItem`),
      content: t(`info.newContent`),
    };
    await postCoverLetters(nickName!, newMockData);
    await fetchCoverData();
  };

  return (
    <>
      {isMobile && selectedId ? undefined : <ProfileSidebar />}
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
                {isEdit ? (
                  <Button onClick={handleSaveClick}>
                    <Check size={24} color="black" />
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleEditClick}>
                      <Edit size={24} color="black" />
                    </Button>
                    <InviteModal />
                  </>
                )}
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
                isEditing={isEdit}
                onClick={handleSectionClick}
                onDelete={handleDelete}
              />
            ))}
            {isEdit ? (
              <Flex justifyContent="center" mt={3} mb={8}>
                <Button onClick={handleAddNewClick}>{t(`info.add_new`)}</Button>
              </Flex>
            ) : undefined}
          </>
        )}
      </Container>
    </>
  );
};

export default MainContent;
