import React, {useEffect, useState} from "react";
import {
  CardViewProps,
  CardType,
  EntryState,
  ModalTabType, CardInfo,
} from "../types/cardTypes";
import {
  Box,
  Button,
  Flex, Heading, Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import CardTypeToggle from "./CardTypeToggle";
import ModalActionButtons from "./ModalActionButton";
import CardModalList from "./CardModalList";
import { useCard } from "../hooks/useCard";
import { useLocation } from "react-router-dom";
import { Share } from "tabler-icons-react";
import InviteModal from "../../../common/components/InviteModal";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import DesignedCard from "./DesigendCards";
import {use} from "i18next";
import Slider from "react-slick";
import {carouselSettings, SampleNextArrow, SamplePrevArrow} from "../../amt/utils/carouselSetting";
import {HorizontalBarDesign, VerticalBarDesign} from "./CardDesigns";

//명함카드 모달창
const CardModalComponent: React.FC<CardViewProps> = ({
  nickName,
    useCardHook
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isEditing, setIsEditing] = React.useState(false);
  const [cardType, setCardType] = React.useState("PUBLIC" as CardType);
  const [entries, setEntries] = React.useState<EntryState[]>([]);
  const [name, setName]= useState<string>("");
  const savedNickName = localStorage.getItem("nickName");
  const isHost = nickName === savedNickName;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const {
    isOpen: isInviteModalOpen,
    onOpen: onInviteModalOpen,
    onClose: onInviteModalClose,
  } = useDisclosure();

  const [cardInfo, setCardInfo] = useState<CardInfo>();

  const {loading} = useCardHook;

  const handleToggle = () => {
    const curType = cardType === "PUBLIC" ? "ORIGINAL" : "PUBLIC";
    setCardType(curType);

    if(curType==="PUBLIC"){
      useCardHook.handleSelectPublicType();
    }else{
      useCardHook.handleSelectOriginType();
    }
  };

  return (
    // <Box width="100%" maxWidth="2xl" margin="0 auto">
    <Box padding={4} borderRadius="xl">
      <Flex align="center" justifyContent="space-between">
        {isHost && (
          <Box ml={5}>
            <CardTypeToggle cardType={cardType} onToggle={handleToggle} />
          </Box>
        )}
      </Flex>

      <Box textAlign="center" mb={4} mt={4}>
        {isHost && (
          <>
            {cardType === "PUBLIC" ? (
              <Text fontSize="md">
                공개: 체크박스 체크시 메인페이지에 보여집니다.
              </Text>
            ) : (
              <Text fontSize="md">
                원본: 체크박스 체크시 남들에게 보여집니다.
              </Text>
            )}
          </>
        )}
      </Box>
      <DesignedCard cardHook={useCardHook} isHost={isHost} detail={true}/>
    </Box>
  );
};

export default CardModalComponent;
