import React from "react";
import { CardModalProps, CardType } from "../types/cardTypes";
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

//명함카드 모달창
const CardModal: React.FC<CardModalProps> = ({ isOpen, onClose, name }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [cardType, setCardType] = React.useState("PUBLIC" as CardType);

  const handleModalClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleToggle = () => {
    setCardType((prev) => (prev === "PUBLIC" ? "ORIGINAL" : "PUBLIC"));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton onClick={handleModalClose} />
        <ModalBody>
          <Flex align="center" mb={4}>
            <Text mr={2}>{cardType === "PUBLIC" ? "공개" : "원본"}</Text>
            <CardTypeToggle cardType={cardType} onToggle={handleToggle} />
          </Flex>
          <Text fontSize="sm" mb={4}>
            체크박스를 통해 메인페이지에 표시여부를 설정할 수 있습니다.
          </Text>
          <Box
            borderRadius="xl"
            mx={{ base: 0, md: 4 }}
            mb={12}
            border={{ base: 0, md: "1px dashed black" }}
          >
            {/* <ModalActionButtons
              cardType={cardType}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
            <CardModalList cardType={cardType} isEditing={isEditing} /> */}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CardModal;
