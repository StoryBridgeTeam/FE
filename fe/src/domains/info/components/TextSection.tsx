import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { FC, useRef, useEffect } from "react";
import { Trash } from "tabler-icons-react";

interface TextSectionProps {
  title: string;
  content: string;
  id: number;
  // isEditing: boolean;
  onClick: (id: number) => void;
  // onDelete: (id: number) => void;
}

const TextSection: FC<TextSectionProps> = ({
  title,
  content,
  id,
  // isEditing,
  onClick,
  // onDelete,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  return (
    <Box w="full" cursor={"pointer"}>
      <Flex alignItems="center" paddingX={2} >
        <Text fontWeight="bold" fontSize={"lg"} onClick={() => onClick(id)}>
          {title}
        </Text>
        <Box flex="1"  borderBottom="2px" ml={2} />
      </Flex>
      <Box
        _hover={{bgColor:"#eeeeee"}}
        mt={-3}
        p={5}
        borderRadius="5"
        border={"1px solid #cdcdcd"}
        borderTop={"none"}
        onClick={() => onClick(id)}
        whiteSpace="pre-wrap"
        maxH="15em"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        <Box
          dangerouslySetInnerHTML={{ __html: content }}
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitLineClamp: "6",
            WebkitBoxOrient: "vertical",
          }}
        />
        {/* <Text noOfLines={6}>{content}</Text> */}
      </Box>
    </Box>
  );
};

export default TextSection;
