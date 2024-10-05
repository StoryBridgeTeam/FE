import {
  Box,
  Heading,
  Spinner,
  useBreakpointValue,
  VStack,
  Text,
  Flex,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCard } from "../hooks/useCard";
import { EntryState } from "../types/cardTypes";
import CardInfoBox from "./CardInfoBox";
import SelfIntroductionBox from "./SelfIntoductionBox";
import { Share } from "tabler-icons-react";
import InviteModal from "../../../common/components/InviteModal";
import {getCoverLetters} from "../../info/api/InfoAPI";

export interface CoverLetter {
  id: number;
  title: string;
  content: string;
}

//명함카드 영역 컴포넌트
const CardComponent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { nickName = "" } = useParams<{ nickName: string }>();
  const { loading, error, checkCard, fetchPublicCard } = useCard({
    nickname: nickName,
  });
  const [hasCard, setHasCard] = useState<boolean>(false);
  const [briefEntries, setBriefEntries] = useState<EntryState[]>([]);
  const savedNickName = localStorage.getItem("nickName");
  const isHost = nickName === savedNickName;
  const [name, setName] = useState<string>("");
  const [cardId, setCardId] = useState<number | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const navigate = useNavigate();
  const {
    isOpen: isInviteModalOpen,
    onOpen: onInviteModalOpen,
    onClose: onInviteModalClose,
  } = useDisclosure();

  const [coverLetter, setCoverLetter] = useState<CoverLetter[]>([]);

  useEffect(() => {
    if (nickName) {
      if (token) {
        checkCard(nickName, token).then((result) => {
          if (result) {
            setHasCard(true);
            fetchPublicCard(nickName, "BRIEF", token).then((data) => {
              setBriefEntries(data.entries);
              setName(data.name);
              setCardId(data.id);
            });
          } else {
            setHasCard(false);
          }
        });
      } else {
        checkCard(nickName).then((result) => {
          if (result) {
            setHasCard(true);
            fetchPublicCard(nickName, "BRIEF").then((data) => {
              setBriefEntries(data.entries);
              setName(data.name);
              setCardId(data.id);
            });
          } else {
            setHasCard(false);
          }
        });
      }

    }
  }, [nickName, token]);

  useEffect(() => {
    fetchCoverData();
  }, [])

  const fetchCoverData = async () => {
    try {
      // setLoading(true);
      let entries;

      if (token) {
        const response = await getCoverLetters(nickName!, token);
        entries = response.entries;
      } else {
        const response = await getCoverLetters(nickName!);
        entries = response.entries;
      }

      if (entries.content === null) {
        setCoverLetter([]);
      } else {
        setCoverLetter(entries.content);
      }
    } catch (error) {
      // console.error("cover error:", error);
      setCoverLetter([]);
    } finally {
      // setLoading(false);
    }
  };

  const handleClick = () => {
    const url = `/${nickName}/card`;
    const searchParams = new URLSearchParams();

    if (token) {
      searchParams.append("token", token);
    }

    navigate(`${url}?${searchParams.toString()}`);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <VStack
      bg="#F6F6F6"
      borderRadius="3xl"
      h="auto"
      w="100%"
      overflow="hidden"
      p={5}
      border={isMobile ? "none" : "1px solid #cdcdcd"}
      spacing={5}
      minWidth={"300px"}
    >
      <Box
        w={"100%"}
        bg={"white"}
        height={"auto"}
        borderRadius={"3xl"}
        // shadow={"md"}
        p={4}
        boxSizing={"border-box"}
      >
        <VStack align="stretch" spacing={2} color="black" flex={1} h={"100%"} position={"relative"} p={5}>
          {isHost && (
              <Button size="sm" bg="white" onClick={onInviteModalOpen} position={"absolute"} right={0} top={0}>
                <Share size={20} color="black" />
              </Button>
          )}
          {hasCard && (
            <Flex alignItems="center" justifyContent="space-between">
              <Heading
                fontSize={isMobile ? "md" : "x-large"}
                textAlign="left"
              >
                {name}
              </Heading>
            </Flex>
          )}
          <CardInfoBox
            briefEntries={briefEntries}
            onClick={handleClick}
            hasCard={hasCard}
            isHost={isHost}
          />
        </VStack>
      </Box>
      <SelfIntroductionBox coverLetters={coverLetter}/>
      {isInviteModalOpen && (
        <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose} />
      )}
    </VStack>
  );
};

export default CardComponent;
