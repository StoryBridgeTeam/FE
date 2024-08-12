import {
  Container,
  Button,
  Heading,
  Flex,
  useBreakpointValue,
  Text,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { Edit, Check } from "tabler-icons-react";
import DetailPage from "./DetailPage";
import { useTranslation } from "react-i18next";
import TextSection from "./TextSection";
import ProfileSidebar from "./ProfileSideBar";
import { useProfileStore } from "../Store/useProfileStore";
import { getCoverLetters, putCoverLetters } from "../api/InfoAPI";
import { useCommentStore } from "../Store/CommentStore";
import { getComments } from "../api/CommentAPI";
import { useParams } from "react-router-dom";
import { getNicknameToken } from "../../../common/utils/nickname";

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
  const name = getNicknameToken();
  const ishost = nickName === name;

  useEffect(() => {
    const fetchCoverData = async () => {
      try {
        setLoading(true);
        const { entries } = await getCoverLetters(nickName!);
        if (entries === null) {
          setMockData([]);
        } else {
          setMockData(entries);
        }
        setLoading(false);
      } catch (error) {
        console.error("cover error:", error);
        setLoading(false);
      }
    };

    fetchCoverData();
  }, [nickName]);

  const updateServerData = async (updatedMockData: MockData[]) => {
    try {
      const newCover = await putCoverLetters(nickName!, updatedMockData);
      if (newCover === null) {
        setMockData([]);
      } else {
        setMockData(newCover);
      }
    } catch (error) {
      console.error("cover error:", error);
    }
  };

  const handleSectionClick = async (id: number) => {
    try {
      const response = await getComments(id);
      if (response) {
        setComments(response);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("comment error:", error);
    }

    setSelectedId(id);
  };

  const handleBackClick = () => {
    setComments([]);
    setSelectedId(null);
  };

  const handleEditClick = () => {
    setEdit(!isEdit);
  };

  const handleSaveClick = () => {
    updateServerData(mockData);
    setEdit(false);
  };

  const handleDelete = (id: number) => {
    const updatedMockData = mockData.filter((item) => item.id !== id);
    setMockData(updatedMockData);
    updateServerData(updatedMockData);
  };

  const handleAddNewClick = async () => {
    const newId = 1000;
    const newMockData: MockData = {
      id: newId,
      title: t(`info.newItem`),
      content: t(`info.newContent`),
    };
    const updatedMockData = [...mockData, newMockData];

    await updateServerData(updatedMockData);
  };

  const handleSaveDetail = (
    id: number,
    updatedData: { title: string; content: string }
  ) => {
    const updatedMockData = mockData.map((item) =>
      item.id === id ? { ...item, ...updatedData } : item
    );

    setMockData(updatedMockData);
    updateServerData(updatedMockData);
  };

  return (
    <>
      {isMobile && selectedId ? undefined : <ProfileSidebar />}
      <Container maxW="4xl">
        {selectedId ? (
          <DetailPage
            id={selectedId}
            data={mockData.find((item) => item.id === selectedId)!}
            onSave={handleSaveDetail}
            onBack={handleBackClick}
          />
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
                  <Button onClick={handleEditClick}>
                    <Edit size={24} color="black" />
                  </Button>
                )}
              </Flex>
            )}
            <Flex justifyContent="center" mb={5} mt={ishost ? 12 : undefined}>
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
