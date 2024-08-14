import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  FormControl,
  Image,
  Flex,
  useToast,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { getNicknameToken } from "../../../common/utils/nickname";

const ProfileForm: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toast = useToast();
  const [image, setImage] = useState<string>("");
  const [profile, setProfile] = useState({
    nickname: "",
    existPassword: "",
    newPassword: "",
    correctPassword: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    toast({
      title: "Profile saved.",
      description: "We've updated your profile information.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = () => {
    toast({
      title: "Profile deleted.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Flex
      p={5}
      border={"1px solid #CDCDCD"}
      borderRadius={"30px"}
      w={isMobile ? "full" : "800px"}
      height={"585px"}
      ml={"10px"}
    >
      <VStack align="stretch" spacing={4} w="full">
        <FormControl>
          <Flex m={"10px"} w={"100%"}>
            <Text fontWeight={"bold"} minW={"70px"} mr={"50px"}>
              이미지
            </Text>
            {image ? (
              <Image src={image} boxSize="200px" borderRadius="full" />
            ) : (
              <Box boxSize="200px" bg="gray.200" borderRadius="full" />
            )}
            <Flex flex={"1"} alignItems={"end"} justifyContent={"right"}>
              <Button
                mr={3}
                onClick={() => document.getElementById("imageUpload")?.click()}
              >
                수정
              </Button>
              <Button mr={3} onClick={() => console.log("삭제")}>
                삭제
              </Button>
              <Input
                id="imageUpload"
                type="file"
                hidden
                onChange={handleImageChange}
              />
            </Flex>
          </Flex>
        </FormControl>
        <Flex mt={"40px"} m={"10px"} w={"100%"} alignItems={"center"}>
          <Text fontWeight={"bold"} minW={"70px"} mr={"50px"}>
            닉네임
          </Text>
          <Input
            placeholder={getNicknameToken()}
            name="nickname"
            value={profile.nickname}
            onChange={handleInputChange}
            w={"50%"}
          />
          <Flex flex={"1"} alignItems={"end"} justifyContent={"right"}>
            <Button mr={3} onClick={() => console.log("삭제")}>
              중복체크
            </Button>
            <Button mr={3} onClick={() => console.log("삭제")}>
              저장
            </Button>
          </Flex>
        </Flex>{" "}
        <Flex mt={"40px"} m={"10px"} w={"100%"}>
          <Text fontWeight={"bold"} w={"70px"} mr={"50px"}>
            비밀번호
          </Text>
          <Flex w={"50%"} direction={"column"}>
            <Input
              placeholder={"기존 비밀번호"}
              type="password"
              name="existPassword"
              value={profile.existPassword}
              onChange={handleInputChange}
              mb={3}
            />
            <Input
              placeholder={"새 비밀번호"}
              type="password"
              name="newPassword"
              value={profile.newPassword}
              onChange={handleInputChange}
              mb={3}
            />
            <Input
              placeholder={"새 비밀번호 확인"}
              type="password"
              name="correctPassword"
              value={profile.correctPassword}
              onChange={handleInputChange}
            />
          </Flex>

          <Flex flex={"1"} alignItems={"end"} justifyContent={"right"}>
            <Button mr={3} onClick={() => console.log("삭제")}>
              비밀번호 변경
            </Button>
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  );
};

export default ProfileForm;
