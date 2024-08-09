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
import { FC, useEffect, useState, useCallback } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import {
  getCard,
  getAdditionalInfo,
  createAdditionalInfo,
  deleteAdditionalInfo,
} from "../api/SideBarAPI";
import { getNicknameToken } from "../../../common/utils/nickname";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

type AboutMeItem = { [key: string]: string };

type EducationItem = {
  id: number;
  startDate: string;
  endDate: string;
  content: string;
};

const ProfileSidebar: FC = () => {
  const { nickName } = useParams<{ nickName: string }>();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const name = getNicknameToken();
  const { t } = useTranslation();
  const [aboutMe, setAboutMe] = useState<AboutMeItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const ishost = nickName === name;

  const {
    isOpen: isAddEducationOpen,
    onOpen: onAddEducationOpen,
    onClose: onAddEducationClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteEducationOpen,
    onOpen: onDeleteEducationOpen,
    onClose: onDeleteEducationClose,
  } = useDisclosure();

  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newItem, setNewItem] = useState("");
  const [selectedEducationId, setSelectedEducationId] = useState<number | null>(
    null
  );

  const [selectedEducation, setSelectedEducation] =
    useState<EducationItem | null>(null);

  const fetchAdditionalInfo = useCallback(async () => {
    try {
      const additionalInfo = await getAdditionalInfo(nickName!);
      if (Array.isArray(additionalInfo)) {
        setEducation(additionalInfo);
      } else {
        console.error("Unexpected format for additionalInfo:", additionalInfo);
        setEducation([]);
      }
    } catch (error) {
      console.error("Error fetching additional info:", error);
      setEducation([]);
    }
  }, []);

  const fetchCardData = useCallback(async () => {
    try {
      const card = await getCard(nickName!);
      if (Array.isArray(card)) {
        setAboutMe(card);
      } else {
        console.error("Unexpected format for card:", card);
        setAboutMe([]);
      }
    } catch (error) {
      console.error("Card error:", error);
    }
  }, [nickName]);

  useEffect(() => {
    fetchCardData();
    fetchAdditionalInfo();
  }, [fetchCardData, fetchAdditionalInfo]);

  const addEducation = async () => {
    if (newStartDate && newEndDate && newItem) {
      await createAdditionalInfo(nickName!, newStartDate, newEndDate, newItem);
      await fetchAdditionalInfo();
      setNewStartDate("");
      setNewEndDate("");
      setNewItem("");
      onAddEducationClose();
    }
  };

  const handleEducationDelete = async () => {
    if (selectedEducationId !== null) {
      await deleteAdditionalInfo(nickName!, selectedEducationId);
      await fetchAdditionalInfo();
      setSelectedEducationId(null);
      setSelectedEducation(null);
      onDeleteEducationClose();
    }
  };

  const confirmDeleteEducation = (id: number) => {
    const educationItem = education.find((item) => item.id === id) || null;
    setSelectedEducation(educationItem);
    setSelectedEducationId(id);
    onAddEducationClose();
    onDeleteEducationOpen();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const formatEducation = (
    education: EducationItem[],
    t: (key: string) => string
  ): React.ReactNode => {
    if (!Array.isArray(education) || education.length === 0) {
      return <Text>{t(`info.noEducation`)}</Text>;
    }

    return education.map(({ id, startDate, endDate, content }) => (
      <Flex key={id} justify="space-between" align="center" mb={2}>
        <Text fontSize="10px" whiteSpace="pre-wrap">{`• ${formatDate(
          startDate
        )} ~ ${formatDate(endDate)} ${content}`}</Text>
        {ishost && (
          <FiMinus
            onClick={() => confirmDeleteEducation(id)}
            fontSize="xs"
            cursor="pointer"
          />
        )}
      </Flex>
    ));
  };

  const formatAboutMe = (
    aboutMe: AboutMeItem[],
    t: (key: string) => string
  ): React.ReactNode => {
    if (!Array.isArray(aboutMe) || aboutMe.length === 0) {
      return <Text>{t(`info.noPersonal`)}</Text>;
    }

    return aboutMe.map((item, index) => (
      <Flex key={index} justify="space-between" align="center" mb={2}>
        <Text whiteSpace="pre-wrap">{`• ${Object.keys(item)[0]}: ${
          item[Object.keys(item)[0]]
        }`}</Text>
      </Flex>
    ));
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
      <Heading size="md">{nickName}</Heading>
      <Divider borderColor="#C5C5C5" />
      <InfoSection
        title={t(`info.personal`)}
        content={formatAboutMe(aboutMe, t)}
      />
      <InfoSection
        title={t(`info.education`)}
        content={formatEducation(education, t)}
        actions={
          ishost && <FiPlus onClick={onAddEducationOpen} cursor="pointer" />
        }
      />
      <Modal isOpen={isAddEducationOpen} onClose={onAddEducationClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(`info.addEducation`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>{t(`info.startDate`)}</FormLabel>
              <Input
                type="date"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>{t(`info.endDate`)}</FormLabel>
              <Input
                type="date"
                value={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>{t(`info.item`)}</FormLabel>
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={addEducation}>
              {t(`info.plus`)}
            </Button>
            <Button variant="ghost" onClick={onAddEducationClose}>
              {t(`info.close`)}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteEducationOpen} onClose={onDeleteEducationClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t(`info.confirmDelete`)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEducation && (
              <Box>
                <Text mt={2}>
                  <strong>{t(`info.startDate`)}:</strong>{" "}
                  {formatDate(selectedEducation.startDate)}
                </Text>
                <Text mt={1}>
                  <strong>{t(`info.endDate`)}:</strong>{" "}
                  {formatDate(selectedEducation.endDate)}
                </Text>
                <Text mt={1}>
                  <strong>{t(`info.content`)}:</strong>{" "}
                  {selectedEducation.content}
                </Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onDeleteEducationClose}>
              {t(`info.cancel`)}
            </Button>
            <Button colorScheme="red" mr={3} onClick={handleEducationDelete}>
              {t(`info.delete`)}
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
    borderRadius="full"
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

export default ProfileSidebar;
