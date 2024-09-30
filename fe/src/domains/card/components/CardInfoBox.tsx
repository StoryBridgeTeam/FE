import React from "react";
import { EntryState } from "../types/cardTypes";
import {Box, Center, ListItem, UnorderedList, Text, VStack} from "@chakra-ui/react";
import CardInfoItem from "./CardInfoItem";

// 메인페이지에서 보여지는 명함카드 정보
const CardInfoBox: React.FC<{
  briefEntries: EntryState[];
  onClick: () => void;
  hasCard: boolean;
  isHost: boolean;
}> = ({ briefEntries = [], onClick, hasCard, isHost }) => (
  <Box
      borderBottom={"2px solid gray"}
    // borderRadius="xl"
    onClick={onClick}
    cursor="pointer"
      // _hover={{ bg: "gray.200" }}
    h="200px"
    boxSizing={"border-box"}
    pt={"40px"}
    px={1}
  >
    {hasCard ? (
      briefEntries.length > 0 ? (
          <VStack gap={1} w={"100%"} alignItems={"start"}>
              {briefEntries.map((entry) => (
                    <CardInfoItem {...entry} />
              ))}
          </VStack>
      ) : (
        <Center w="100%" h="100%">
          <Text fontSize="2xl" color="gray.500">
            빈 명함입니다
          </Text>
        </Center>
      )
    ) : (
      <Center w="100%" fontSize="2xl" color="gray.700">
        {isHost
          ? "명함카드를 만들어보세요!"
          : "명함카드를 만들지 않은 사용자입니다"}
      </Center>
    )}
  </Box>
);

export default CardInfoBox;
