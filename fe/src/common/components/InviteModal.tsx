import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { getInvitationToken } from "../api/invitationAPI";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const toast = useToast();

  const handleInvite = async () => {
    setLoading(true);
    try {
      const token = await getInvitationToken();
      const currentUrl = window.location.href;
      const linkWithToken = `${currentUrl}?token=${token}`;
      setInviteLink(linkWithToken);

      navigator.clipboard.writeText(linkWithToken);

      toast({
        title: "초대 링크가 복사되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error generating invite link:", error);
      toast({
        title: "초대 링크 생성에 실패했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (inviteLink) {
      try {
        await navigator.share({
          title: "초대 링크",
          text: "다음 링크를 통해 초대합니다:",
          url: inviteLink,
        });
      } catch (error) {
        console.error("Error sharing invite link:", error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>초대 링크 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Spinner />
          ) : inviteLink ? (
            <Input value={inviteLink} isReadOnly />
          ) : (
            "초대하기 버튼을 클릭하면 링크가 생성됩니다."
          )}
        </ModalBody>

        <ModalFooter>
          {!inviteLink && (
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleInvite}
              disabled={loading}
            >
              초대하기
            </Button>
          )}
          {inviteLink && (
            <Button colorScheme="teal" mr={3} onClick={handleShare}>
              공유하기
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
