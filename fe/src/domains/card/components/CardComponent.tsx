import {
  Box,
  Heading,
  useBreakpointValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCard } from "../hooks/useCard";
import { EntryState } from "../types/cardTypes";
import CardInfoBox from "./CardInfoBox";
import CardModal from "./CardModal";
import SelfIntroductionBox from "./SelfIntoductionBox";
import FirstCardModal from "./FirstCardModal";

//명함카드 영역 컴포넌트
const CardComponent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { nickName } = useParams<{ nickName: string }>();
  const { checkCard, fetchPublicCard, name } = useCard();
  const [hasCard, setHasCard] = useState<boolean>(false);
  const [briefEntries, setBriefEntries] = useState<EntryState[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (nickName) {
      checkCard(nickName).then((result) => {
        console.log("checkCard_result:", result);
        if (result) {
          setHasCard(true);
          fetchPublicCard(nickName, "BRIEF").then((entries) => {
            setBriefEntries(entries);
          });
        } else {
          setHasCard(false);
        }
      });
    }
  }, [nickName]);

  return (
    <VStack
      bg="#F6F6F6"
      borderRadius="3xl"
      h="100%"
      w="100%"
      overflow="hidden"
      p={5}
      color="#CDCDCD"
      border={isMobile ? "none" : "1px solid"}
      spacing={5}
    >
      <Box
        width="100%"
        mx="auto"
        p={4}
        bg="white"
        shadow="md"
        borderRadius="3xl"
        flex={4}
        display="flex"
        flexDirection="column"
      >
        <VStack align="stretch" spacing={2} color="black" flex={1}>
          {hasCard && (
            <Heading fontSize={isMobile ? "md" : "xl"} textAlign="center">
              {name}
            </Heading>
          )}
          <CardInfoBox
            briefEntries={briefEntries}
            onClick={onOpen}
            hasCard={hasCard}
          />
        </VStack>
        {hasCard ? (
          <CardModal isOpen={isOpen} onClose={onClose} name={name} />
        ) : (
          <FirstCardModal
            isOpen={isOpen}
            onClose={onClose}
            nickName={nickName!}
          />
        )}
      </Box>
      <SelfIntroductionBox />
    </VStack>
  );
};

export default CardComponent;
