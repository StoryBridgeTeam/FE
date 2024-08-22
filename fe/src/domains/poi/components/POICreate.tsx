import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  Divider,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import { usePOI } from "../../poi/hooks/usePOI";

const POICreate: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const MAX_TITLE_LENGTH = 50;

  const { addPOI, loading, error } = usePOI();
  const navigate = useNavigate();
  const { showToast } = useToastMessage();
  const nickname = localStorage.getItem("nickName");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.slice(0, MAX_TITLE_LENGTH);
    setTitle(newTitle);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const isButtonDisabled = title.trim() === "" || content.trim() === "";

  const handleCreatePOI = useCallback(async () => {
    try {
      await addPOI(nickname!, { id: null, title, content, index: 0 });
      navigate(`/${nickname}`);
      showToast("POI 생성 성공", "POI가 성공적으로 생성되었습니다.", "success");
    } catch (error) {
      console.error("Failed to create POI:", error);
      showToast("POI 생성 실패", "POI 생성에 실패했습니다.", "error");
    }
  }, [nickname, title, content, addPOI, navigate, showToast]);

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <VStack spacing={4} align="stretch" p={6}>
      <Input
        placeholder="제목"
        size="lg"
        variant="unstyled"
        fontSize="2xl"
        fontWeight="bold"
        _placeholder={{ color: "#828282" }}
        textAlign="center"
        value={title}
        onChange={handleTitleChange}
        maxLength={MAX_TITLE_LENGTH}
        isDisabled={loading}
      />
      <Text fontSize="sm" color="gray.500" textAlign="right" mt={-5}>
        {title.length}/{MAX_TITLE_LENGTH}
      </Text>
      <Divider borderColor="#828282" borderWidth="1px" />
      <Textarea
        minHeight="550px"
        placeholder="본문 내용을 작성해주세요"
        variant="unstyled"
        px={6}
        value={content}
        onChange={handleContentChange}
        isDisabled={loading}
      />
      <Box textAlign="center">
        <Button
          isDisabled={isButtonDisabled}
          colorScheme="blue"
          onClick={handleCreatePOI}
          leftIcon={loading ? <Spinner size="sm" /> : undefined}
        >
          {loading ? "생성 중..." : "POI 생성"}
        </Button>
      </Box>
    </VStack>
  );
};

export default POICreate;
