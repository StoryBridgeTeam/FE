import React from "react";
import { Trash } from "tabler-icons-react";
import CardInfoItem from "./CardInfoItem";
import { EntryState } from "../types/cardTypes";
import {
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  ListItem,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CardModalItemProps } from "../types/cardTypes";

// 카드 컴포넌트와 카드 모달 창(편집 상태)에서 엔트리 항목을 출력해주는 컴포넌트
const CardModalItem: React.FC<CardModalItemProps> = ({
  entry,
  isEditing,
  onChangeEntry,
  onDeleteEntry,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeEntry(entry.id, { title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeEntry(entry.id, { content: e.target.value });
  };

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeEntry(entry.id, { isVisibleBriefCard: e.target.checked });
  };

  const handleDeleteClick = () => {
    onDeleteEntry(entry.id);
  };

  return (
    <ListItem>
      {isEditing ? (
        <Flex alignItems="center">
          <Checkbox
            isChecked={entry.isVisibleBriefCard}
            onChange={handleVisibilityChange}
            m={2}
            size="lg"
          />
          <Input
            value={entry.title}
            onChange={handleTitleChange}
            fontWeight="bold"
            size="sm"
            width="35%"
            mr={2}
            placeholder="항목"
          />
          <Input
            value={entry.content}
            onChange={handleContentChange}
            size="sm"
            width="65%"
            placeholder="설명"
          />
          <Button size="sm" onClick={handleDeleteClick} bg="white">
            <Trash color="red" />
          </Button>
        </Flex>
      ) : (
        <Flex alignItems="center">
          <CardInfoItem key={entry.id} {...entry} />
          <Icon
            as={entry.isVisibleBriefCard ? FaEye : FaEyeSlash}
            color={entry.isVisibleBriefCard ? "blue.500" : "red.500"}
            ml={2}
          />
        </Flex>
      )}
    </ListItem>
  );
};

export default CardModalItem;
