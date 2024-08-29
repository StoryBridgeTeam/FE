import React, { useEffect } from "react";
import { CardModalProps, CardType, EntryState } from "../types/cardTypes";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import CardTypeToggle from "./CardTypeToggle";
import ModalActionButtons from "./ModalActionButton";
import CardModalList from "./CardModalList";
import { useCard } from "../hooks/useCard";
import { useLocation } from "react-router-dom";

//명함카드 모달창
const CardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  name,
  nickName,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [cardType, setCardType] = React.useState("PUBLIC" as CardType);
  const [entries, setEntries] = React.useState<EntryState[]>([]);
  const savedNickName = localStorage.getItem("nickName");
  const isHost = nickName === savedNickName;
  const { fetchPublicCard, fetchOriginalCard } = useCard();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleModalClose = () => {
    setIsEditing(false);
    setCardType("PUBLIC");
    onClose();
  };

  const handleToggle = () => {
    setCardType((prev) => (prev === "PUBLIC" ? "ORIGINAL" : "PUBLIC"));
  };

  const loadPublicEntries = async () => {
    try {
      let data;
      if (token) {
        data = await fetchPublicCard(nickName!, "DETAIL", token);
      } else {
        data = await fetchPublicCard(nickName!, "DETAIL");
      }
      setEntries(data.entries);
    } catch (err) {
      console.error("Failed to fetch PublicEntries", err);
    }
  };

  const loadOriginalEntries = async () => {
    try {
      let data;
      if (token) {
        data = await fetchOriginalCard(nickName!, "DETAIL", token);
      } else {
        data = await fetchOriginalCard(nickName!, "DETAIL");
      }
      setEntries(data.entries);
      console.log("loadOriginalEntries_data:", data);
    } catch (err) {
      console.error("Failed to fetch OriginalEntries", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (cardType === "PUBLIC") {
        loadPublicEntries();
      } else if (cardType === "ORIGINAL") {
        loadOriginalEntries();
      }
    }
  }, [isOpen, cardType, nickName, token]);

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton onClick={handleModalClose} />
        <ModalBody>
          <Flex align="center" mb={4}>
            <CardTypeToggle cardType={cardType} onToggle={handleToggle} />
          </Flex>
          {cardType === "PUBLIC" ? (
            <Text fontSize="sm" mb={4}>
              공개: 체크박스 체크시 메인페이지에 보여집니다.
            </Text>
          ) : (
            <Text fontSize="sm" mb={4}>
              원본: 체크박스 체크시 남들에게 보여집니다.
            </Text>
          )}

          <Box
            borderRadius="xl"
            mx={{ base: 0, md: 4 }}
            mb={12}
            border={{ base: 0, md: "1px dashed black" }}
          >
            {isHost && (
              <ModalActionButtons
                cardType={cardType}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                nickName={nickName}
                entries={entries}
                setEntries={setEntries}
              />
            )}
            <CardModalList
              isEditing={isEditing}
              entries={entries}
              setEntries={setEntries}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CardModal;
