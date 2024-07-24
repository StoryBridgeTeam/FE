import React from "react";
import { Text, Link } from "@chakra-ui/react";
import { CardState } from "../stores/useCardStore";

const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const CardInfoItem: React.FC<CardState> = ({ title, content }) => {
  const isUrl = urlRegex.test(content);

  return (
    <>
      <Text as="span" fontWeight="bold" fontSize="sm" width="20%" mr={2}>
        {title}:
      </Text>
      {isUrl ? (
        <Link
          href={content.startsWith("http") ? content : `https://${content}`}
          isExternal
          color="blue.500"
          fontSize="sm"
        >
          {content}
        </Link>
      ) : (
        <Text as="span" fontSize="sm">
          {content}
        </Text>
      )}
    </>
  );
};

export default CardInfoItem;
