import {
  Box,
  Flex,
  VStack,
  Heading,
  Divider,
  Text,
  Button,
  Input,
  useBreakpointValue,
  useDisclosure,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { getNicknameToken } from "../../../login/api/nickname";
import { getCard } from "../../api/SideBarAPI";

const ProfileSidebar: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const name = getNicknameToken();
  const [aboutMe, setAboutMe] = useState<Array<{ [key: string]: string }>>([]);
  const [education, setEducation] = useState<
    Array<{ date: string; item: string }>
  >([
    { date: "2024.03.01", item: "초등학교" },
    { date: "2024.03.01", item: "중학교" },
    { date: "2024.03.01", item: "고등학교" },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newDate, setNewDate] = useState("");
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const card = await getCard();
        if (card === null) {
          setAboutMe([]);
        } else {
          setAboutMe(card);
          console.log(card);
        }
      } catch (error) {
        console.error("Card error:", error);
      }
    };

    fetchCardData();
  }, []);

  const addEducation = () => {
    if (newDate && newItem) {
      setEducation([...education, { date: newDate, item: newItem }]);
      setNewDate("");
      setNewItem("");
      onClose();
    }
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <VStack
      w={isMobile ? "full" : "280px"}
      p={5}
      alignItems="center"
      bg="#F6F6F6"
      spacing={4}
    >
      <ProfileImage />
      <Heading size="md">{name}</Heading>
      <Divider borderColor="#C5C5C5" />
      <InfoSection title="인적사항" content={formatAboutMe(aboutMe)} />
      <InfoSection
        title="학력 및 경력"
        content={formatEducation(education, removeEducation)}
        actions={<FiPlus onClick={onOpen} cursor="pointer" />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>새 학력 및 경력 추가</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>날짜</FormLabel>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>항목</FormLabel>
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={addEducation}>
              추가
            </Button>
            <Button variant="ghost" onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

const ProfileImage: FC = () => (
  <Box
    w="150px"
    h="150px"
    borderRadius="50"
    backgroundImage="url(https://image.idus.com/image/files/da17e0c53a4e480284c5d49932722e5a.jpg)"
    backgroundSize="cover"
    backgroundPosition="center"
  />
);

const InfoSection: FC<{
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, content, actions }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box w="full" justifyContent="center" p={2}>
      <Flex align="center" justify="space-between" mb={2}>
        <Box
          w="full"
          h="25px"
          lineHeight="25px"
          bg="#dbdbdb"
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <Text>{title}</Text>
          {actions && (
            <Box position="absolute" ml={2} right={3}>
              {actions}
            </Box>
          )}
        </Box>
      </Flex>
      <Box
        w="full"
        maxW="90%"
        fontSize="xs"
        textAlign="left"
        whiteSpace="pre-wrap"
        mt={2}
        p={isMobile ? 5 : 3}
        mx="auto"
        bg="white"
        borderRadius={"md"}
        border={"1px"}
        borderColor="#dbdbdb"
      >
        {content}
      </Box>
    </Box>
  );
};

const formatEducation = (
  education: Array<{ date: string; item: string }>,
  removeEducation: (index: number) => void
): React.ReactNode => {
  if (education.length === 0) {
    return <Text>학력 및 경력이 없습니다.</Text>;
  }

  return education.map(({ date, item }, index) => (
    <Flex key={index} justify="space-between" align="center" mb={2}>
      <Text whiteSpace="pre-wrap">{`• ${date} ${item}`}</Text>
      <FiMinus
        onClick={() => removeEducation(index)}
        fontSize="md"
        cursor="pointer"
      />
    </Flex>
  ));
};

const formatAboutMe = (
  aboutMe: Array<{ [key: string]: string }>
): React.ReactNode => {
  if (aboutMe.length === 0) {
    return <Text>인적사항이 없습니다.</Text>;
  }

  return aboutMe.map((item, index) => (
    <Flex key={index} justify="space-between" align="center" mb={2}>
      <Text whiteSpace="pre-wrap">{`• ${Object.keys(item)[0]}: ${
        item[Object.keys(item)[0]]
      }`}</Text>
    </Flex>
  ));
};

export default ProfileSidebar;
