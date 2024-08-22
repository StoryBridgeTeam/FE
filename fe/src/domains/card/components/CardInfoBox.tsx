import React from "react";

import { Box, UnorderedList, ListItem, Center } from "@chakra-ui/react";
import CardInfoItem from "./CardInfoItem";
import { EntryState } from "../types/cardTypes";

//메인페이지에서 보여지는 명함카드 정보
const CardInfoBox: React.FC<{
  entries: EntryState[];
  onClick: () => void;
  hasCard: boolean;
}> = ({ entries, onClick, hasCard }) => (
  <Box
    border="1px dashed black"
    borderRadius="xl"
    p={4}
    // m={4}
    onClick={onClick}
    cursor="pointer"
    h="100%"
    _hover={{ bg: "gray.200" }}
    // flex={1}
    // display="flex"
  >
    {hasCard ? (
      // <Center ml={{ base: 0, md: 8 }}>
      //   <UnorderedList styleType="disc" spacing={3}>
      //     {entries
      //       .filter((entry) => entry.isVisibleBriefCard)
      //       .map((entry) => (
      //         <ListItem key={entry.id}>
      //           <CardInfoItem key={entry.id} {...entry} />
      //         </ListItem>
      //       ))}
      //   </UnorderedList>
      // </Center>
      // <UnorderedList styleType="disc" spacing={3}>
      <UnorderedList styleType="disc">
        {entries
          .filter((entry) => entry.isVisibleBriefCard)
          .map((entry) => (
            <ListItem key={entry.id}>
              <CardInfoItem key={entry.id} {...entry} />
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
