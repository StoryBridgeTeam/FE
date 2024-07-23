import React from "react";
import {
  ListItem,
  Text,
  Link,
  Input,
  Flex,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { Trash } from "tabler-icons-react";
import { CardState } from "../stores/useCardStore";
import CardInfoItem from "./CardInfoItem";

interface CardModalItemProps {
  card: CardState;
  isEditing: boolean;
  onCardChange: (updatedCard: Partial<CardState>) => void;
  onDeleteCard: () => void;
}

const CardModalItem: React.FC<CardModalItemProps> = ({
  card,
  isEditing,
  onCardChange,
  onDeleteCard,
}) => {
  return (
    <ListItem>
      <Flex alignItems="center">
        {isEditing ? (
          <>
            <Checkbox
              isChecked={card.isVisibleBriefCard}
              onChange={(e) =>
                onCardChange({ isVisibleBriefCard: e.target.checked })
              }
              ml={2}
              mr={4}
              size="md"
            />
            <Input
              value={card.title}
              onChange={(e) => onCardChange({ title: e.target.value })}
              fontWeight="bold"
              size="sm"
              width="20%"
              mr={2}
            />
            <Input
              value={card.content}
              onChange={(e) => onCardChange({ content: e.target.value })}
              size="sm"
              width="60%"
            />

            <Button size="xs" ml={2} onClick={onDeleteCard}>
              <Trash size={12} color="red" />
            </Button>
          </>
        ) : (
          <>
            <CardInfoItem key={card.id} {...card} />
            {card.isVisibleBriefCard ? (
              <Text as="span" fontSize="xs" color="green.500" ml={2}>
                (표시됨)
              </Text>
            ) : (
              <Text as="span" fontSize="xs" color="red.500" ml={2}>
                (숨겨짐)
              </Text>
            )}
          </>
        )}
      </Flex>
    </ListItem>
  );
};

export default CardModalItem;
