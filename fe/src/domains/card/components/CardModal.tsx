import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Switch,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { useCardStore } from "../stores/cardStore";
import ModalActionButtons from "./ModalActionButtons";
import { CardType, CardModalProps } from "../types/cardTypes";
import CardModalList from "./CardModalList";
// import CardList from "./CardList";

//명함모달창을 띄워준다.
const CardModal: React.FC<CardModalProps> = ({ isOpen, onClose, name }) => {
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [cardType, setCardType] = React.useState<CardType>("public");

  const handleModalClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleToggle = () => {
    setCardType((prev) => (prev === "public" ? "original" : "public"));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{name}</ModalHeader>
        <ModalCloseButton onClick={handleModalClose} />
        <ModalBody>
          <Flex align="center" mb={4}>
            <Text mr={2}>{cardType === "public" ? "공개" : "원본"}</Text>
            <Switch
              isChecked={cardType === "original"}
              onChange={handleToggle}
              size="lg"
            />
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
            <ModalActionButtons
              cardType={cardType}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
            <CardModalList cardType={cardType} isEditing={isEditing} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CardModal;

// import React from "react";
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   Box,
//   Button,
//   Flex,
//   Spacer,
//   Text,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { Edit, Check, Plus } from "tabler-icons-react";
// import { useCardModal } from "../hooks/useCardModal";
// import CardList from "./CardList";
// import { useCardStore } from "../stores/CardStore";

// interface CardModalProps {
//   name: string;
// }

// interface ModalActionButtonsProps {
//   isEditing: boolean;
//   onEdit: () => void;
//   onSave: () => void;
//   onAddNew: () => void;
// }

// const ModalActionButtons: React.FC<ModalActionButtonsProps> = ({
//   isEditing,
//   onEdit,
//   onSave,
//   onAddNew,
// }) => (
//   <Flex m={2}>
//     <Spacer />
//     {isEditing ? (
//       <Box mb={2}>
//         <Button size="xs" mr={2} onClick={onAddNew}>
//           <Plus size={12} color="black" />
//         </Button>
//         <Button size="xs" mr={2} onClick={onSave}>
//           <Check size={12} color="black" />
//         </Button>
//       </Box>
//     ) : (
//       <Button size="xs" onClick={onEdit}>
//         <Edit size={12} color="black" />
//       </Button>
//     )}
//   </Flex>
// );

// const CardModal: React.FC<CardModalProps> = ({ name }) => {
//   const { isOpen, onClose } = useDisclosure();
//   const { handleEntryChange, handleAddNewEntry, handleDeleteEntry, onDragEnd } = useCardModal();
//   const { entries } = useCardStore();
//   const [isEditing, setIsEditing] = React.useState(false);

//   const handleModalClose = () => {
//     setIsEditing(false);
//     onClose();
//   };

//   const handleEditMode = () => setIsEditing(true);
//   const handleSave = () => {
//     // Save logic here
//     setIsEditing(false);
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
//       <ModalOverlay />
//       <ModalContent>
//         <ModalHeader>{name}</ModalHeader>
//         <ModalCloseButton onClick={handleModalClose} />
//         <ModalBody>
//           {isEditing && (
//             <Text fontSize="sm" mb={4}>
//               체크박스를 통해 메인페이지에 표시여부를 설정할 수 있습니다.
//             </Text>
//           )}

//           <Box
//             borderRadius="xl"
//             mx={{ base: 0, md: 4 }}
//             mb={12}
//             border={{ base: 0, md: "1px dashed black" }}
//           >
//             <ModalActionButtons
//               isEditing={isEditing}
//               onEdit={handleEditMode}
//               onSave={handleSave}
//               onAddNew={handleAddNewEntry}
//             />
//             <CardList
//               entries={entries}
//               isEditing={isEditing}
//               onEntryChange={handleEntryChange}
//               onDeleteEntry={handleDeleteEntry}
//               onDragEnd={onDragEnd}
//             />
//           </Box>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default CardModal;
