import React from "react";
import { Text, Link } from "@chakra-ui/react";
import { EntryState } from "../types/cardTypes";

const urlRegex =
  /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

//카드컴포넌트와 카드모달창(편집상태가 아닌)에서 엔트리 개별항목을 출력해주는 컴포넌트
const CardInfoItem: React.FC<EntryState> = ({ title, content }) => {
  const isUrl = urlRegex.test(content);

  return (
    <>
      <Text as="span" fontWeight="bold" fontSize="md" mr={2}>
        {title}:
      </Text>
      {isUrl ? (
        <Link
          href={content.startsWith("http") ? content : `https://${content}`}
          isExternal
          color="blue.500"
          fontSize="md"
        >
          {content}
        </Link>
      ) : (
        <Text as="span" fontSize="md">
          {content}
        </Text>
      )}
    </>
  );
};

export default CardInfoItem;
