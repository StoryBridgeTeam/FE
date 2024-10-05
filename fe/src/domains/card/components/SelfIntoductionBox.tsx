import {Box, Flex, Heading, Text, VStack} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {CoverLetter} from "./CardComponent";
import React, {FC, useRef} from "react";

//자기소개페이지로 이동하는 버튼
const SelfIntroductionBox = ({coverLetters}:{coverLetters:CoverLetter[] | []}) => {
  const navigate = useNavigate();
  const { nickName } = useParams<{ nickName: string }>();
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleClick = () => {
    const url = `/${nickName}/info`;
    const searchParams = new URLSearchParams();

    if (token) {
      searchParams.append("token", token);
    }

    navigate(`${url}?${searchParams.toString()}`);
  };

  return (
    <VStack
      width="100%"
      p={4}
      bg="white"
      // border="1px solid"
      _hover={{ bg: "gray.200" }}
      // shadow="md"
      // borderRadius="3xl"
        borderRadius="10px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      // flex={1}
      cursor="pointer"
      maxH={"250px"}
      // maxHeight="50px"
      //   height={"100%"}
      onClick={handleClick}
    >
      <Heading size={"sm"} w={"100%"}>
        {t("main.CardComponent.self-introduction")}
      </Heading>
      <VStack gap={2} mt={3} w={"100%"} overflowY={"hidden"} position={"relative"}>
        {
          coverLetters.length==0 &&
            <Box p={2}>
              <Heading color={"gray.300"} size={"sm"}>등록된 자기소개서가 없습니다.</Heading>
            </Box>
        }
        {coverLetters.map((data) => (
            <TextSection
                key={data.id}
                title={data.title}
                content={data.content}
            />
        ))}
        {
          coverLetters.length!=0 &&
            <Box
                background={"linear-gradient(to bottom, rgba(255,255,255, 0.5) 50%, rgba(255,255,255, 0.9) 75%, rgba(255,255,255, 0.9) 90%, white 100% )"}
                position={"absolute"}
                left={0}
                bottom={0}
                w={"100%"}
                h={"100%"}
                alignItems={"end"}
                justifyContent={"center"}
            />
        }
      </VStack>
    </VStack>
  );
};

const TextSection = ({ title, content}:{title:string, content:string}) => {
  return (
      <Box w="full">
        <Flex alignItems="center" paddingX={2} >
          <Text fontWeight="bold" fontSize={"sm"}>
            {title}
          </Text>
          <Box flex="1"  borderBottom="2px" ml={2} />
        </Flex>
        <Box
            mt={-3}
            p={3}
            borderRadius="5"
            border={"1px solid #cdcdcd"}
            borderTop={"none"}
            whiteSpace="pre-wrap"
            maxH="15em"
            overflow="hidden"
            textOverflow="ellipsis"
        >
          <Box
              fontSize={"x-small"}
              dangerouslySetInnerHTML={{ __html: content }}
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitLineClamp: "6",
                WebkitBoxOrient: "vertical",
              }}
          />
          {/* <Text noOfLines={6}>{content}</Text> */}
        </Box>
      </Box>
  );
};

export default SelfIntroductionBox;
