import React, { useEffect } from "react";
import { useCardStore } from "../stores/cardStore";
import {
  Box,
  VStack,
  Heading,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import CardInfoBox from "./CardInfoBox";
import CardModal from "./CardModal";
import FirstCardModal from "./FirstCardModal";
import SelfIntroductionBox from "./SelfIntroductionBox";
import { useTempStore } from "../stores/tempStore";

//명함카드 영역 컴포넌트
const CardComponent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const {
    publicEntries,
    originalEntries,
    fetchPublicEntries,
    fetchOriginalEntries,
    name,
    hasCard,
    setNickName,
  } = useCardStore();
  const { addTempEntry, tempEntries } = useTempStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { nickName } = useParams<{ nickName: string }>();

  useEffect(() => {
    if (nickName) {
      setNickName(nickName); //처음 카드가 없는 경우도 닉네임을 받아올수 있도록
      fetchPublicEntries(nickName);
      fetchOriginalEntries(nickName);
    }
  }, [nickName]);

  useEffect(() => {
    //처음 카드를 생성할때 임시엔트리 하나를 추가해준다.
    //처음에 추가가 안되는 경우가 있음
    if (!hasCard && tempEntries.length === 0) {
      addTempEntry();
    }
  }, []); // 추가된 useEffect

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
      // display="flex"
    >
      <Box
        width="100%"
        mx="auto"
        // p={6}
        p={4}
        bg="white"
        shadow="md"
        borderRadius="3xl"
        flex={10}
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
            entries={publicEntries}
            onClick={onOpen}
            hasCard={hasCard}
          />
        </VStack>
        {hasCard ? (
          <CardModal isOpen={isOpen} onClose={onClose} name={name} />
        ) : (
          <FirstCardModal isOpen={isOpen} onClose={onClose} name={name} />
        )}
      </Box>
      <SelfIntroductionBox />
    </VStack>
  );
};

export default CardComponent;
