//카드컴포넌트와 카드모달창(편집상태)에서 엔트리 항목을 출력해주는 컴포넌트
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
import { useTempStore } from "../stores/tempStore";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface CardModalItemProps {
  entry: EntryState;
  isEditing: boolean;
}

const CardModalItem: React.FC<CardModalItemProps> = ({ entry, isEditing }) => {
  const { modifyTempEntry, deleteTempEntry } = useTempStore();

  return (
    <ListItem>
      {isEditing ? (
        <Flex alignItems="center">
          <Checkbox
            isChecked={entry.isVisibleBriefCard}
            onChange={(e) =>
              modifyTempEntry(entry.id, {
                isVisibleBriefCard: e.target.checked,
              })
            }
            m={2}
            size="lg"
          />
          <Input
            value={entry.title}
            onChange={(e) =>
              modifyTempEntry(entry.id, { title: e.target.value })
            }
            fontWeight="bold"
            size="sm"
            width="35%"
            mr={2}
            placeholder="항목"
          />
          <Input
            value={entry.content}
            onChange={(e) =>
              modifyTempEntry(entry.id, { content: e.target.value })
            }
            size="sm"
            width="65%"
            placeholder="설명"
          />

          <Button
            size="sm"
            onClick={() => deleteTempEntry(entry.id)}
            bg="white"
          >
            <Trash color="red" />
          </Button>
        </Flex>
      ) : (
        <>
          <CardInfoItem key={entry.id} {...entry} />
          <Icon
            as={entry.isVisibleBriefCard ? FaEye : FaEyeSlash}
            color={entry.isVisibleBriefCard ? "blue.500" : "red.500"}
            ml={2}
          />
        </>
      )}
    </ListItem>
  );
};

export default CardModalItem;
