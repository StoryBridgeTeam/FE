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
  Avatar, HStack,
} from "@chakra-ui/react";
import { FC, useEffect, useState, useCallback } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import {
  getCard,
  getAdditionalInfo,
  createAdditionalInfo,
  deleteAdditionalInfo,
  getCardProfile,
} from "../api/SideBarAPI";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

type AboutMeItem = { [key: string]: string };

type EducationItem = {
  id: number;
  startDate: string;
  endDate: string;
  content: string;
};

interface ProfileSidebarProps{
  nickname:string
}

const ProfileSidebar = ({nickname}:ProfileSidebarProps) => {
  // const { nickName } = useParams<{ nickName: string }>();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const name = localStorage.getItem("nickName");
  const { t } = useTranslation();
  const [aboutMe, setAboutMe] = useState<AboutMeItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const ishost = nickname === name;
  const [image, setImage] = useState<string>();

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

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const fetchAdditionalInfo = useCallback(async () => {
    try {
      let additionalInfo;
      if (token) {
        additionalInfo = await getAdditionalInfo(nickname!, token);
      } else {
        additionalInfo = await getAdditionalInfo(nickname!);
      }

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
      let image;
      let card;
      if (token) {
        card = await getCard(nickname!, token);
        image = await getCardProfile(nickname!, token);
      } else {
        card = await getCard(nickname!);
        image = await getCardProfile(nickname!);
      }
      if (Array.isArray(card)) {
        setAboutMe(card);
      } else {
        console.error("Unexpected format for card:", card);
        setAboutMe([]);
      }
      setImage(image.path);
    } catch (error) {
      console.error("Card error:", error);
    }
  }, [nickname]);

  useEffect(() => {
    fetchCardData();
    fetchAdditionalInfo();
  }, [fetchCardData, fetchAdditionalInfo]);

  useEffect(() => {
    fetchCardData();
    fetchAdditionalInfo();
  }, []);

  const addEducation = async () => {
    if (newStartDate && newEndDate && newItem) {
      await createAdditionalInfo(nickname!, newStartDate, newEndDate, newItem);
      await fetchAdditionalInfo();
      setNewStartDate("");
      setNewEndDate("");
      setNewItem("");
      onAddEducationClose();
    }
  };

  const handleEducationDelete = async () => {
    if (selectedEducationId !== null) {
      await deleteAdditionalInfo(nickname!, selectedEducationId);
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
    const year = date.getFullYear().toString();
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
      <>
        <Flex key={id} justify="space-between" align="center">
          <Text whiteSpace="pre-wrap">{`• ${formatDate(startDate)}~${formatDate(
            endDate
          )}`}</Text>
          {ishost && (
            <FiMinus
              onClick={() => confirmDeleteEducation(id)}
              fontSize="xs"
              cursor="pointer"
            />
          )}
        </Flex>
        <Text whiteSpace="pre-wrap" mb={2} ml={2}>{`${content}`}</Text>
      </>
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
        <Text whiteSpace="pre-wrap">{`• ${item.title}: ${item.content}`}</Text>
      </Flex>
    ));
  };

  return (
    <Flex
        direction={"column"}
      w={isMobile ? "100%" : "400px"}
      minWidth={"280px"}
        // w={"100%"}
      p={5}
      alignItems="center"
      // bg="#F6F6F6"
      gap={4}
    >
      <VStack w={"100%"} maxW={"600px"}>
        <Flex
            w={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={4}
            direction={"column"}
        >
          <Avatar
              size="2xl"
              src={image ? `${process.env.REACT_APP_IMAGE_SERVER}/${image}` : `/images/profile.png`}
              mr={2}
          />
          <Heading size="md">{nickname}</Heading>
        </Flex>
        <Divider borderColor="#C5C5C5" orientation={isMobile ? "vertical" : "horizontal"}/>
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
      </VStack>
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
    </Flex>
  );
};

const InfoSection: FC<{
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, content, actions }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box w="full" justifyContent="center" p={4}>
      <Flex align="center" justify="space-between" mb={2}>
        <Box
          w="full"
          h="25px"
          lineHeight="25px"
          // bg="#dbdbdb"
          // borderRadius="full"
            px={2}
          fontSize="md"
          fontWeight="bold"
          textAlign="left"
          display="flex"
          alignItems="center"
          justifyContent="start"
          zIndex={999}
        >
          <Text>{title}</Text>
          <Box flex="1"  borderBottom="2px" ml={2} />
        </Box>
      </Flex>
      <Box
        w="full"
        fontSize="sm"
        textAlign="left"
        whiteSpace="pre-wrap"
        mt={-5}
        p={5}
        bg="white"
        borderRadius={"md"}
        border={"1px"}
        borderTop={"none"}
        borderColor="#dbdbdb"
      >
          {content}
        {actions && (
            <HStack  w={"100%"} justifyContent={"center"} mt={2}>
              {actions}
            </HStack>
        )}
      </Box>
    </Box>
  );
};

export default ProfileSidebar;
