import {
  Box,
  Flex,
  VStack,
  Heading,
  Divider,
  Text,
  useBreakpointValue,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { Edit, Check } from "tabler-icons-react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../login/stores/useAuthStore";

const ProfileSidebar: FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const { id: userId } = useAuthStore((state) => state);
  const isMobile = useBreakpointValue({ base: true, md: false });


  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("이름");
  const [aboutMe, setAboutMe] = useState("자기소개입니다");
  const [contact, setContact] = useState(
    "이메일 : namename@kumoh.ac.kr\n전화번호 : 010-2222-2222"
  );
  const [education, setEducation] = useState(
    "20XX.03.01 00 초등학교\n20XX.03.01 00 중학교\n20XX.03.01 00 고등학교"
  );

  const handleEditClick = () => setIsEditing(!isEditing);

  return (
    <VStack
      w={isMobile ? "full" : "280px"}
      p={5}
      alignItems="center"
      bg="#F6F6F6"
      spacing={2}
    >
      <Flex w="full" justifyContent="flex-end" alignItems="center">
        {id === userId && (
          <IconButton
            aria-label="Edit profile"
            icon={
              isEditing ? (
                <Check size={24} color="gray" />
              ) : (
                <Edit size={24} color="gray" />
              )
            }
            onClick={handleEditClick}
            variant="ghost"
          />
        )}
      </Flex>
      <ProfileImage />
      {isEditing ? (
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="md"
          textAlign="center"
        />
      ) : (
        <Heading size="md">{name}</Heading>
      )}
      <Divider borderColor="#C5C5C5" />
      <InfoSection
        title="About Me"
        content={aboutMe}
        isEditing={isEditing}
        onChange={(value) => setAboutMe(value)}
      />
      <InfoSection
        title="Contact"
        content={contact}
        isEditing={isEditing}
        onChange={(value) => setContact(value)}
      />
      <InfoSection
        title="학력"
        content={education}
        isEditing={isEditing}
        onChange={(value) => setEducation(value)}
      />
    </VStack>
  );
};

const ProfileImage: FC = () => (
  <Box
    w="150px"
    h="150px"
    borderRadius={20}
    backgroundImage="url(https://image.idus.com/image/files/da17e0c53a4e480284c5d49932722e5a.jpg)"
    backgroundSize="cover"
    backgroundPosition="center"
  />
);

const InfoSection: FC<{
  title: string;
  content: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}> = ({ title, content, isEditing, onChange }) => (
  <>
    <Box
      mt={2}
      w="200px"
      h="25px"
      lineHeight={"25px"}
      bg="#dbdbdb"
      borderRadius={20}
      textAlign={"center"}
      fontSize="xs"
      fontWeight={"Bold"}
    >
      {title}
    </Box>
    {isEditing ? (
      <Input
        value={content}
        onChange={(e) => onChange(e.target.value)}
        size="xs"
        mt={1}
      />
    ) : (
      <Box w="200px" fontSize={"xs"} textAlign={"center"}>
        <Text whiteSpace="pre-line">{content}</Text>
      </Box>
    )}
  </>
);

export default ProfileSidebar;
