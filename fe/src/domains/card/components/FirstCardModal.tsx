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
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FirstCardModalProps, EntryState } from "../types/cardTypes";
import React, { useEffect } from "react";
import { useCard } from "../hooks/useCard";
import ModalActionButtons from "./ModalActionButton";
import CardModalList from "./CardModalList";
import { use } from "i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";

//첫번째 카드생성을 위한 모달창
const FirstCardModal: React.FC<FirstCardModalProps> = ({ nickName }) => {
  const { loading, error, createNewCard } = useCard();
  const [isEditing, setIsEditing] = React.useState<boolean>(true);
  const [newEntries, setNewEntries] = React.useState<EntryState[]>([]);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const localNickname = localStorage.getItem("nickName");
  const isHost = localNickname === nickName;
  const navigate = useNavigate();
  const handleSubmit = () => {
    createNewCard(nickName, newEntries);
    navigate(`/${localNickname}`);
  };

  if (!isHost) {
    return <Navigate to={`/${nickName}`} replace />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box padding={4} borderRadius="xl">
      <Flex align="center" justifyContent="space-between">
        <Box flex="1" textAlign="center">
          <Text fontSize={isMobile ? "xl" : "4xl"} fontWeight="bold">
            명함카드를 만들어보세요
          </Text>
        </Box>
        {/* <Box width="100px" /> */}
      </Flex>

      <Box textAlign="center" mb={4} mt={4}>
        <Text fontSize="md">체크박스 체크시 메인페이지에 보여집니다.</Text>
      </Box>

      <Box
        borderRadius="xl"
        mx={{ base: 0, md: 4 }}
        mt={4}
        mb={12}
        border={{ base: 0, md: "1px dashed black" }}
      >
        <ModalActionButtons
          cardType={"NEW"}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          nickName={nickName}
          entries={newEntries}
          setEntries={setNewEntries}
        />

        <CardModalList
          isEditing={isEditing}
          entries={newEntries}
          setEntries={setNewEntries}
        />
      </Box>
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          onClick={handleSubmit}
          bg="blue.300"
          color="white"
          width="30%"
          borderRadius="xl"
          isDisabled={newEntries.length === 0}
        >
          생성하기
        </Button>
      </Box>
    </Box>
  );
};

export default FirstCardModal;
