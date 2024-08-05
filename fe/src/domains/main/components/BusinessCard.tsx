import React, { useEffect, useState } from "react";
import { useCardStore, CardState } from "../stores/useCardStore";
import {
  Box,
  VStack,
  Heading,
  UnorderedList,
  ListItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { mockData2 } from "../mainData";
import CardModal from "./CardModal";
import CardInfoItem from "./CardInfoItem";
import { useNavigate, useParams } from "react-router-dom";
import { getNicknameToken } from "../../login/api/nickname";

const CardInfoBox: React.FC<{ cards: CardState[]; onClick: () => void }> = ({
  cards,
  onClick,
}) => (
  <Box
    border="1px dashed black"
    borderRadius="xl"
    p={4}
    onClick={onClick}
    cursor="pointer"
    h="100%"
    _hover={{ bg: "gray.200" }}
  >
    <UnorderedList>
      <Box>
        {cards
          .filter((card) => card.isVisibleBriefCard)
          .map((card) => (
            <ListItem display="flex">
              <CardInfoItem key={card.id} {...card} />
            </ListItem>
          ))}
      </Box>
    </UnorderedList>
  </Box>
);

const IntroductionBox: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${getNicknameToken()}/info`);
  };

  return (
    <Box
      width="100%"
      mx="auto"
      p={4}
      bg="white"
      border="1px solid"
      _hover={{ bg: "gray.200" }}
      shadow="md"
      borderRadius="3xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex={1}
      cursor="pointer"
      onClick={handleClick}
    >
      자기소개서
    </Box>
  );
};

const CardComponent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { name, cards, addCard, setName } = useCardStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (cards.length === 0) {
      mockData2.forEach(addCard);
    }
    setName("홍길동 (Gil-dong Hong)");
  }, [cards.length, addCard, setName]);

  const handleBoxClick = () => setIsModalOpen(true);

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
      >
        <VStack align="stretch" spacing={2} color="black">
          <Heading size={isMobile ? "xs" : "sm"} textAlign="center">
            {name}
          </Heading>
          <CardInfoBox cards={cards} onClick={handleBoxClick} />
        </VStack>
        <CardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          name={name}
        />
      </Box>
      <IntroductionBox />
    </VStack>
  );
};

export default CardComponent;
