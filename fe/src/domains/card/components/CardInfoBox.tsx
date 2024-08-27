import React from "react";
import { EntryState } from "../types/cardTypes";
import { Box, Center, ListItem, UnorderedList } from "@chakra-ui/react";
import CardInfoItem from "./CardInfoItem";

//메인페이지에서 보여지는 명함카드 정보
const CardInfoBox: React.FC<{
  briefEntries: EntryState[];
  onClick: () => void;
  hasCard: boolean;
}> = ({ briefEntries, onClick, hasCard }) => (
  <Box
    border="1px dashed black"
    borderRadius="xl"
    p={4}
    onClick={onClick}
    cursor="pointer"
    h="100%"
    _hover={{ bg: "gray.200" }}
  >
    {hasCard ? (
      <UnorderedList styleType="disc">
        {briefEntries
          // .filter((entry) => entry.isVisibleBriefCard)
          ?.map((entry) => (
            <ListItem key={entry.id}>
              <CardInfoItem {...entry} />
            </ListItem>
          ))}
      </UnorderedList>
    ) : (
      <Center w="100%" fontSize="2xl" color="gray.700">
        명함카드를 만들어보세요!
      </Center>
    )}
  </Box>
);
export default CardInfoBox;
