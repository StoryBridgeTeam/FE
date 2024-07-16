import {
  Container,
  Button,
  Heading,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { Edit, Check } from "tabler-icons-react";
import DetailPage from "./DetailPage";
import { useTranslation } from "react-i18next";
import TextSection from "./TextSection";
import ProfileSidebar from "./ProfileSideBar";

interface MockData {
  id: number;
  title: string;
  content: string;
}

const initialMockData: MockData[] = [
  {
    id: 1,
    title: "000 항목",
    content: `[대회 이름]에 참가하게 된 동기는 [대회 참여 동기] 때문입니다. 이 대회는 [대회에 대한 설명 및 목표]라는 점에서 저의 관심을 끌었습니다. 특히, [특정 요소]가 저에게 매우 매력적으로 다가왔습니다.
대회를 준비하면서, 저는 [준비 과정]에 주력했습니다. 처음에는 [어려움]에 부딪혔지만, [문제 해결 방법]을 통해 극복할 수 있었습니다. 팀원들과의 협업도 중요한 부분이었는데, 우리는 [팀워크 경험]을 통해 서로의 강점을 최대한 활용했습니다.
대회 기간 동안, 저는 [구체적인 활동]을 통해 많은 것을 배웠습니다.이 대회를 통해 저는 [개인적인 성장 또는 배운 점]을 느꼈고, 앞으로의 목표를 더욱 명확히 할 수 있었습니다.`,
  },
  {
    id: 2,
    title: "000 항목",
    content: "리더십 경험에 대해 설명해 주세요.",
  },
  {
    id: 3,
    title: "000 항목",
    content: "팀 프로젝트 경험에 대해 설명해 주세요.",
  },
  {
    id: 4,
    title: "000 항목",
    content: "리더십 경험에 대해 설명해 주세요.",
  },
];

const MainContent: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [mockData, setMockData] = useState<MockData[]>(initialMockData);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  const handleSectionClick = (id: number) => {
    if (!isEditing) {
      setSelectedId(id);
    }
  };

  const handleBackClick = () => {
    setSelectedId(null);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleDelete = (id: number) => {
    setMockData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setMockData((prevData) =>
      prevData.map((data) =>
        data.id === id ? { ...data, [field]: value } : data
      )
    );
  };

  const handleAddNewClick = () => {
    const newId = mockData.length + 1;
    const newMockData: MockData = { id: newId, title: "", content: "" };
    setMockData([...mockData, newMockData]);
    setIsEditing(true);
  };

  return (
    <>
      {isMobile && selectedId ? undefined : <ProfileSidebar />}
      <Container maxW="4xl" mt={5}>
        {selectedId ? (
          <>
            <Flex w="full" justifyContent="flex-end" alignItems="center">
              <Button onClick={handleBackClick}>{t(`info.list`)}</Button>
            </Flex>
            <DetailPage id={selectedId} />
          </>
        ) : (
          <>
            <Flex w="full" justifyContent="flex-end" alignItems="center">
              {isEditing ? (
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
                isEditing={isEditing}
                onClick={handleSectionClick}
                onChange={handleInputChange}
                onDelete={handleDelete}
              />
            ))}
            <Flex justifyContent="center" mt={3} mb={8}>
              <Button onClick={handleAddNewClick}>{t(`info.add_new`)}</Button>
            </Flex>
          </>
        )}
      </Container>
    </>
  );
};

export default MainContent;
