import {
  Container,
  Button,
  Heading,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { Edit, Check } from "tabler-icons-react";
import DetailPage from "./DetailPage";
import { useTranslation } from "react-i18next";
import TextSection from "./TextSection";
import ProfileSidebar from "./ProfileSideBar";
import { useProfileStore } from "../../Store/useProfileStore";
import { getCoverLetters, putCoverLetters } from "../../api/InfoAPI";

interface MockData {
  id: number;
  title: string;
  content: string;
}

const MainContent: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [mockData, setMockData] = useState<MockData[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { t } = useTranslation();
  const { isEdit, setEdit } = useProfileStore();

  useEffect(() => {
    const fetchCoverData = async () => {
      try {
        const cover = await getCoverLetters();
        if (cover === null) {
          setMockData([]);
        } else {
          setMockData(cover);
        }
      } catch (error) {
        console.error("cover error:", error);
      }
    };

    fetchCoverData();
  }, []);

  const updateServerData = async (updatedMockData: MockData[]) => {
    try {
      const newCover = await putCoverLetters(updatedMockData);
      if (newCover === null) {
        setMockData([]);
      } else {
        setMockData(newCover);
      }
    } catch (error) {
      console.error("cover error:", error);
    }
  };

  const handleSectionClick = (id: number) => {
    if (!isEdit) {
      setSelectedId(id);
    }
  };

  const handleBackClick = () => {
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
    const newId =
      mockData.length > 0
        ? Math.max(...mockData.map((item) => item.id)) + 1
        : 1;
    console.log(newId);
  };

  const handleSaveDetail = (
    id: number,
    updatedData: { title: string; content: string }
  ) => {
    console.log(id);
    const updatedMockData = mockData.map((item) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    setMockData(updatedMockData);
    updateServerData(updatedMockData);
  };

  return (
    <>
      {isMobile && selectedId ? undefined : <ProfileSidebar />}
      <Container maxW="4xl" mt={5}>
        {selectedId ? (
          <DetailPage
            id={selectedId}
            data={mockData.find((item) => item.id === selectedId)!}
            onSave={handleSaveDetail}
            onBack={handleBackClick}
          />
        ) : (
          <>
            <Flex w="full" justifyContent="flex-end" alignItems="center">
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
            <Flex justifyContent="center" mb={5}>
              <Heading size="lg">{t(`info.info`)}</Heading>
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
