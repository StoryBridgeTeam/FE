import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Button,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useCardStore } from "../stores/cardStore";
import ModalActionButtons from "./ModalActionButtons";
import { CardModalProps } from "../types/cardTypes";
import CardModalList from "./CardModalList";
import { useCardEdit } from "../hooks/useCardEdit";
import { useTempStore } from "../stores/tempStore";
import { useNavigate } from "react-router-dom";
// import CardList from "./CardList";

//첫번째 카드생성을 위해 명함모달창을 띄워준다.
const FirstCardModal: React.FC<CardModalProps> = ({
  isOpen,
  onClose,
  name,
}) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(true);
  const { handleCreateCard } = useCardEdit();
  const { nickName } = useCardStore();
  // const [cardType, setCardType] = React.useState<CardType>("public");

  const handleModalClose = () => {
    onClose();
  };

  const handleButtonClick = () => {
    handleCreateCard();
    onClose();
    // window.location.href = `/${nickName}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={3} textAlign="center">
          <Text fontSize="2xl" as="b">
            명함카드를 만들어보세요!
          </Text>
        </ModalHeader>
        <ModalCloseButton onClick={handleModalClose} />
        <ModalBody display="flex" flexDirection="column" alignItems="center">
          <Text fontSize="sm" mb={4} textAlign="center">
            체크박스를 통해 메인페이지에 표시여부를 설정할 수 있습니다 (최대
            5개)
          </Text>

          <Box
            borderRadius="xl"
            mx={{ base: 0, md: 4 }}
            mb={6}
            border={{ base: 0, md: "1px dashed black" }}
            width="100%"
          >
            <ModalActionButtons
              cardType={"public"}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
            <CardModalList cardType={"public"} isEditing={isEditing} />
          </Box>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button colorScheme="blue" onClick={handleButtonClick}>
            카드 생성하기!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FirstCardModal;
