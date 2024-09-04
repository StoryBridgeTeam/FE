import React, {useEffect, useState} from "react";
import {
  CardViewProps,
  CardType,
  EntryState,
  ModalTabType,
} from "../types/cardTypes";
import {
  Box,
  Button,
  Flex,
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

  const {loading, error, fetchPublicCard, fetchOriginalCard} = useCardHook;

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
      setName(data.name);
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
      setName(data.name);
      console.log("loadOriginalEntries_data:", data);
    } catch (err) {
      console.error("Failed to fetch OriginalEntries", err);
    }
  };

  useEffect(() => {
    if (cardType === "PUBLIC") {
      loadPublicEntries();
    } else {
      loadOriginalEntries();
    }
  }, [nickName, token, cardType]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    // <Box width="100%" maxWidth="2xl" margin="0 auto">
    <Box padding={4} borderRadius="xl">
      <Flex align="center" justifyContent="space-between">
        {isHost && (
          <Box ml={5}>
            <CardTypeToggle cardType={cardType} onToggle={handleToggle} />
          </Box>
        )}

        <Box flex="1" textAlign="center">
          <Text fontSize={isMobile ? "xl" : "4xl"} fontWeight="bold">
            {name}
          </Text>
        </Box>
        {isHost && (
          <Box ml={14} mr={6}>
            <Share onClick={onInviteModalOpen} cursor="pointer" />
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

      <Box
        borderRadius="xl"
        mx={{ base: 0, md: 4 }}
        mt={4}
        mb={12}
        border={{ base: 0, md: "1px dashed black" }}
      >
        {isHost ? (
          <ModalActionButtons
            cardType={cardType}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            nickName={nickName}
            entries={entries}
            setEntries={setEntries}
          />
        ) : (
          <Box mb={10} />
        )}
        <CardModalList
          isEditing={isEditing}
          entries={entries}
          setEntries={setEntries}
        />
      </Box>
      {
        isInviteModalOpen &&
          <InviteModal isOpen={isInviteModalOpen} onClose={onInviteModalClose} />
      }
    </Box>
  );
};

export default CardModalComponent;

// return (
//   <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
//     <ModalOverlay />
//     <ModalContent>
//       <ModalHeader>
//         <Flex align="center" justifyContent="space-between">
//           <Box>
//             <CardTypeToggle cardType={cardType} onToggle={handleToggle} />
//           </Box>

//           <Box flex="1" textAlign="center">
//             <Text fontSize={isMobile ? "xl" : "2xl"} fontWeight="bold">
//               {name}
//             </Text>
//           </Box>
//           <Box width="70px" />
//         </Flex>
//       </ModalHeader>

//       <ModalCloseButton onClick={handleModalClose} />

//       <ModalBody>
//         <Box textAlign="center" mb={4} mt={-4}>
//           {cardType === "PUBLIC" ? (
//             <Text fontSize="sm">
//               공개: 체크박스 체크시 메인페이지에 보여집니다.
//             </Text>
//           ) : (
//             <Text fontSize="sm">
//               원본: 체크박스 체크시 남들에게 보여집니다.
//             </Text>
//           )}
//         </Box>

//         {/* CardCommentToggle 컴포넌트에서 tabType을 관리 */}
//         <CardCommentToggle activeTab={tabType} setActiveTab={setTabType} />

//         {tabType === "명함" ? (
//           <Box
//             borderRadius="xl"
//             mx={{ base: 0, md: 4 }}
//             mt={4}
//             mb={12}
//             border={{ base: 0, md: "1px dashed black" }}
//           >
//             {isHost && (
//               <ModalActionButtons
//                 cardType={cardType}
//                 isEditing={isEditing}
//                 setIsEditing={setIsEditing}
//                 nickName={nickName}
//                 entries={entries}
//                 setEntries={setEntries}
//               />
//             )}
//             <CardModalList
//               isEditing={isEditing}
//               entries={entries}
//               setEntries={setEntries}
//             />
//           </Box>
//         ) : (
//           <Box
//             borderRadius="xl"
//             mx={{ base: 0, md: 4 }}
//             mt={4}
//             mb={12}
//             border={{ base: 0, md: "1px dashed black" }}
//           >
//             <CommentList cardId={cardId} nickName={nickName} />
//           </Box>
//         )}
//       </ModalBody>
//     </ModalContent>
//   </Modal>
// );
// };

// export default CardModal;
