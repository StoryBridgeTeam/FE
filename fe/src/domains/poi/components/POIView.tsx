import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  IconButton,
  VStack,
  Heading,
  Divider,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Button,
  useBreakpointValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FiMoreHorizontal, FiEdit, FiTrash2, FiLink } from "react-icons/fi";
import { POI, usePOI } from "../hooks/usePOI";
import CommentList from "./CommentList";
import { useNavigate } from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

interface POIViewProps {
  poiId: string | undefined;
}

const POIView: React.FC<POIViewProps> = ({ poiId }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickName");
  const [poi, setPoi] = useState<POI>();
  const { fetchPOI, loading, error, removePOI } = usePOI();
  const { showToast } = useToastMessage();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (nickname && poiId) {
      fetchPOI(nickname, Number(poiId)).then((data) => setPoi(data));
    }
  }, [nickname, poiId]);

  const handleRemovePOI = async () => {
    await removePOI(Number(poiId));
    setIsAlertOpen(false);
    navigate(`/${nickname}`);
    showToast("POI 삭제 성공", "POI가 성공적으로 삭제되었습니다.", "success");
  };

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <VStack spacing={4} align="stretch" p={6}>
      <Box position="relative" w="100%">
        <Heading
          size="lg"
          fontSize="2xl"
          fontWeight="bold"
          _placeholder={{ color: "#828282" }}
          textAlign="center"
        >
          {poi?.title}
        </Heading>
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <IconButton
              icon={<FiMoreHorizontal />}
              aria-label="Menu"
              variant="ghost"
              position="absolute"
              right="0"
              top="50%"
              transform="translateY(-50%)"
              size="lg"
              fontSize={30}
            />
          </PopoverTrigger>
          <PopoverContent w={isMobile ? "200px" : "140px"}>
            <PopoverArrow />
            <PopoverBody display="flex" flexDirection="column" shadow="xl">
              <Button
                variant="ghost"
                justifyContent="flex-start"
                size={isMobile ? "md" : "sm"}
                leftIcon={<FiEdit />}
              >
                편집
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                size={isMobile ? "md" : "sm"}
                leftIcon={<FiTrash2 />}
                onClick={openAlert}
              >
                삭제
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                size={isMobile ? "md" : "sm"}
                leftIcon={<FiLink />}
              >
                초대링크
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
      <Divider borderColor="#828282" borderWidth="1px" mt={5} mb={5} />
      <Box minHeight="300px" px={6}>
        {poi?.content.split(/\n/).map((line, index) => (
          <React.Fragment key={index}>
            <Text mb={2} display="inline">
              {line}
            </Text>
            {index < poi?.content.split(/\n/).length - 1 && <br />}
          </React.Fragment>
        ))}
      </Box>
      <Divider borderColor="#828282" borderWidth="1px" mt={5} />
      {poiId && nickname && (
        <CommentList poiId={Number(poiId)} nickName={nickname} />
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              삭제 확인
            </AlertDialogHeader>

            <AlertDialogBody>
              이 항목을 정말로 삭제하시겠습니까? <br />이 작업은 되돌릴 수
              없습니다.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                취소
              </Button>
              <Button colorScheme="red" onClick={handleRemovePOI} ml={3}>
                삭제
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default POIView;
