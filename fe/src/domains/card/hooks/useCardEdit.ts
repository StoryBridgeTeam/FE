import { useToast } from "@chakra-ui/react";
import {
  createCardInfo,
  updateOriginalCardInfo,
  updatePublicCardInfo,
} from "../api/cardAPI";
import { useCardStore } from "../stores/cardStore";
import { useTempStore } from "../stores/tempStore";
import { prepareEntriesForAPI } from "../utils/apiUtils";

export const useCardEdit = () => {
  //1)첫 카드 생성
  //컴포넌트에서 temp직접 접근하여 엔트리 생성, 수정, 삭제
  //저장시 temp엔트리를 api createCardInfo로 전달하여 카드 생성 - v1
  //카드 생성 성공시 temp엔트리 public, original로 복사 -v1 => xxx
  //temp 엔트리 초기화 -v2

  //2)public 카드 수정
  //temp엔트리에 public 엔트리 복사 -v3
  //컴포넌트에서 temp직접 접근하여 엔트리 생성, 수정, 삭제
  //저장시 temp엔트리를 api updatePublicCardInfo로 전달하여 카드 수정 -v4
  //카드 수정 성공시 temp엔트리 public로 복사 -v4 => xxx, 성공시 다시 get요청으로 카드 업데이트(prg)
  //temp 엔트리 초기화 -v2

  //3)original 카드 수정
  //temp엔트리에 original 엔트리 복사-v5
  //컴포넌트에서 temp직접 접근하여 엔트리 생성, 수정, 삭제
  //저장시 temp엔트리를 api updateOriginalCardInfo로 전달하여 카드 수정 -v6
  //카드 수정 성공시 temp엔트리 original로 복사 -v6 => xxx, 성공시 다시 get요청으로 카드 업데이트(prg)
  //temp 엔트리 초기화 -v2

  const {
    tempEntries,
    setTempEntries,
    addTempEntry,
    deleteTempEntry,
    modifyTempEntry,
    reorderEntries,
  } = useTempStore();
  const {
    nickName,
    publicEntries,
    originalEntries,
    fetchPublicEntries,
    fetchOriginalEntries,
  } = useCardStore();
  const toast = useToast();

  const handleCreateCard = async () => {
    try {
      const response = await createCardInfo(
        nickName,
        prepareEntriesForAPI(tempEntries)
      );
      setTempEntries([]);
      console.log("success to create card:", response);
      toast({
        title: "명함카드 생성", //명함카드 생성
        description: "이제 모든 서비스를 이용하실 수 있습니다!", //이제 모든 서비스를 이용하실 수 있습니다!
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to create card:", error);
    }
  };

  const handleAddTempEntry = () => {
    if (tempEntries.length < 20) {
      addTempEntry();
    } else {
      toast({
        title: "경고",
        description: "항목은 최대 20개까지 생성할 수 있습니다.", //항목은 최대 20개까지 생성할 수 있습니다.
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const copyCardToTemp = (cardType: "public" | "original") => {
    if (cardType === "public" && publicEntries.length > 0) {
      setTempEntries(publicEntries);
    } else if (cardType === "original" && originalEntries.length > 0) {
      setTempEntries(originalEntries);
    }
  };

  const handleUpdatePublicCard = async () => {
    try {
      const response = await updatePublicCardInfo(
        nickName,
        prepareEntriesForAPI(tempEntries)
      );
      fetchPublicEntries(nickName);
      setTempEntries([]);
      console.log("success to update public card:", response);
    } catch (error) {
      console.error("Failed to update public card:", error);
    }
  };

  const handleUpdateOriginalCard = async () => {
    try {
      const response = await updateOriginalCardInfo(
        nickName,
        prepareEntriesForAPI(tempEntries)
      );
      fetchOriginalEntries(nickName);
      setTempEntries([]);
      console.log("success to update original card:", response);
    } catch (error) {
      console.error("Failed to update original card:", error);
    }
  };

  return {
    tempEntries,
    handleAddTempEntry,
    deleteTempEntry,
    modifyTempEntry,
    reorderEntries,
    handleCreateCard,
    copyCardToTemp,
    handleUpdatePublicCard,
    handleUpdateOriginalCard,
  };
};
