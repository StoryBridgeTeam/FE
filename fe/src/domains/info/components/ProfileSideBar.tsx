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
import { FC, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const ProfileSidebar: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [name] = useState("이름");
  const [aboutMe] = useState<Array<{ [key: string]: string }>>([
    { 직책: "마케팅매니저" },
    { 회사: "ABC 주식회사" },
    { 전화: "010-1111-2222" },
    { 이메일: "asdfklad@naver.com" },
    { 주소: "서울특별시 강남구" },
    { 웹사이트: "www.example.com" },
  ]);
  const [education, setEducation] = useState<
    Array<{ date: string; item: string }>
  >([
    { date: "20XX.03.01", item: "초등학교" },
    { date: "20XX.03.01", item: "중학교" },
    { date: "20XX.03.01", item: "고등학교" },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newDate, setNewDate] = useState("");
  const [newItem, setNewItem] = useState("");

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
      <InfoSection title="About Me" content={formatAboutMe(aboutMe)} />
      <InfoSection
        title="학력"
        content={formatEducation(education, removeEducation)}
        actions={<FaPlus onClick={onOpen} />}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>새 학력 추가</ModalHeader>
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
}> = ({ title, content, actions }) => (
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
      maxW="200px"
      fontSize="xs"
      textAlign="left"
      whiteSpace="pre-wrap"
      mt={2}
      mx="auto"
    >
      {content}
    </Box>
  </Box>
);

const formatEducation = (
  education: Array<{ date: string; item: string }>,
  removeEducation: (index: number) => void
): React.ReactNode => {
  return education.map(({ date, item }, index) => (
    <Flex key={index} justify="space-between" align="center" mb={2}>
      <Text whiteSpace="pre-wrap">{`${date} ${item}`}</Text>
      <FaMinus onClick={() => removeEducation(index)} fontSize="md" />
    </Flex>
  ));
};

const formatAboutMe = (aboutMe: Array<{ [key: string]: string }>): string => {
  return aboutMe
    .map((item) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      return `• ${key}: ${value}`;
    })
    .join("\n");
};

export default ProfileSidebar;
