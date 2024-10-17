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
import {CardInfo, EntryState} from "../types/cardTypes";
import CardInfoBox from "./CardInfoBox";
import SelfIntroductionBox from "./SelfIntoductionBox";
import { Share } from "tabler-icons-react";
import InviteModal from "../../../common/components/InviteModal";
import {getCoverLetters} from "../../info/api/InfoAPI";
import DesignedCard from "./DesigendCards";
import useCardHook from "../hooks/useCardHook";
import {Simulate} from "react-dom/test-utils";

export interface CoverLetter {
  id: number;
  title: string;
  content: string;
}

//명함카드 영역 컴포넌트
const CardComponent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { nickName = "" } = useParams<{ nickName: string }>();
  const savedNickName = localStorage.getItem("nickName");
  const isHost = nickName === savedNickName;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [cardInfo, setCardInfo ] = useState<CardInfo>();

  const useCard = useCardHook(nickName);
  const {loading} = useCard;

  const [coverLetter, setCoverLetter] = useState<CoverLetter[]>([]);

  // useEffect(() => {
  //   if (nickName) {
  //     if (token) {
  //       checkCard(nickName, token).then((result) => {
  //         if (result) {
  //           setHasCard(true);
  //           fetchPublicCard(nickName, "BRIEF", token).then((data) => {
  //             setBriefEntries(data.entries);
  //             setName(data.name);
  //             setCardId(data.id);
  //             setCardInfo(data);
  //           });
  //         } else {
  //           setHasCard(false);
  //         }
  //       });
  //     } else {
  //       checkCard(nickName).then((result) => {
  //         if (result) {
  //           setHasCard(true);
  //           fetchPublicCard(nickName, "BRIEF").then((data) => {
  //             setCardInfo(data);
  //             setBriefEntries(data.entries);
  //             setName(data.name);
  //             setCardId(data.id);
  //           });
  //         } else {
  //           setHasCard(false);
  //         }
  //       });
  //     }
  //
  //   }
  // }, [nickName, token]);

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

  if (loading) {
    return <Spinner />;
  }

  // if (error) {
  //   return <Text color="red.500">{error}</Text>;
  // }

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
        borderRadius={"5"}
        // shadow={"md"}
        // p={4}
        boxSizing={"border-box"}
      >
        <DesignedCard cardHook={useCard} isHost={isHost}
        />
      </Box>
      <SelfIntroductionBox coverLetters={coverLetter}/>
    </VStack>
  );
};

export default CardComponent;
