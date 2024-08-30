import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  FormControl,
  Image,
  Flex,
  Text,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import useProfileForm from "../hook/useProfileForm";
import EmailVerificationModal from "./EmailVertificationModal";

const ProfileForm: React.FC = () => {
  const {
    profile,
    image,
    handleInputChange,
    handleImageChange,
    requestVerification,
    saveNickname,
    savePassword,
  } = useProfileForm();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Flex
        p={5}
        border={"1px solid #CDCDCD"}
        borderRadius={"30px"}
        w={isMobile ? "350px" : "800px"}
        height={"auto"}
        ml={isMobile ? undefined : "30px"}
        direction={"column"}
      >
        <VStack align="stretch" spacing={4} w="full">
          <FormControl>
            <Flex m={"10px"} w={"100%"} direction={isMobile ? "column" : "row"}>
              <Text fontWeight={"bold"} minW={"70px"} mr={"50px"}>
                이미지
              </Text>
              {image ? (
                <Image
                  src={`http://image.storyb.kr/${image}`}
                  boxSize="200px"
                  borderRadius="full"
                />
              ) : (
                <Image
                  src={"/images/profile.png"}
                  border={"1px solid"}
                  borderColor={"gray.200"}
                  boxSize="200px"
                  borderRadius="full"
                />
              )}
              <Flex flex={"1"} alignItems={"end"} justifyContent={"right"}>
                <Button
                  mr={3}
                  onClick={() =>
                    document.getElementById("imageUpload")?.click()
                  }
                >
                  수정
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

          {isMobile && <Divider borderColor="gray.300" />}

          {/* Nickname */}
          <Flex
            mt={"40px"}
            m={"10px"}
            w={"100%"}
            direction={isMobile ? "column" : "row"}
          >
            <Text
              fontWeight={"bold"}
              minW={"70px"}
              mr={"50px"}
              textAlign={"left"}
            >
              닉네임
            </Text>
            <Input
              placeholder={profile.nickname || "닉네임을 입력하세요"}
              name="nickname"
              value={profile.nickname}
              onChange={handleInputChange}
              w={isMobile ? "95%" : "50%"}
              margin={isMobile ? "5px 0" : undefined}
            />
            <Flex flex={"1"} alignItems={"end"} justifyContent={"right"}>
              <Button mr={3} onClick={saveNickname}>
                저장
              </Button>
            </Flex>
          </Flex>

          {isMobile && <Divider borderColor="gray.300" />}

          {/* Email */}
          <Flex
            mt={"40px"}
            m={"10px"}
            w={"100%"}
            direction={isMobile ? "column" : "row"}
          >
            <Text fontWeight={"bold"} minW={"70px"} mr={"50px"}>
              이메일
            </Text>
            <Input
              placeholder={profile.email || "변경할 이메일을 입력하세요"}
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              w={isMobile ? "95%" : "50%"}
              margin={isMobile ? "5px 0" : undefined}
            />
            <Flex flex={"1"} alignItems={"end"} justifyContent={"right"}>
              <Button
                mr={3}
                onClick={() => {
                  requestVerification();
                  setIsModalOpen(true);
                }}
              >
                인증 요청
              </Button>
            </Flex>
          </Flex>

          {isMobile && <Divider borderColor="gray.300" />}

          {/* Password */}
          <Flex
            mt={"40px"}
            m={"10px"}
            w={"100%"}
            direction={isMobile ? "column" : "row"}
          >
            <Text fontWeight={"bold"} w={"70px"} mr={"50px"}>
              비밀번호
            </Text>
            <Flex
              direction={"column"}
              w={isMobile ? "95%" : "50%"}
              margin={isMobile ? "5px 0" : undefined}
            >
              <Input
                placeholder={"기존 비밀번호"}
                name="originPassword"
                value={profile.originPassword}
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
                name="confirmNewPassword"
                value={profile.confirmNewPassword}
                onChange={handleInputChange}
              />
            </Flex>

            <Flex flex={"1"} alignItems={"end"} justifyContent={"right"}>
              <Button mr={3} onClick={savePassword}>
                비밀번호 변경
              </Button>
            </Flex>
          </Flex>
        </VStack>
      </Flex>

      <EmailVerificationModal
        email={profile.email}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProfileForm;
