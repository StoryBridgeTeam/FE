import { Box, Text, Flex, Input, Textarea, IconButton } from "@chakra-ui/react";
import { FC, useRef, useEffect } from "react";
import { Trash } from "tabler-icons-react"; // Import necessary icons

interface TextSectionProps {
  title: string;
  content: string;
  id: number;
  isEditing: boolean;
  onClick: (id: number) => void;
  onChange: (id: number, field: string, value: string) => void;
  onDelete: (id: number) => void;
}

const TextSection: FC<TextSectionProps> = ({
  title,
  content,
  id,
  isEditing,
  onClick,
  onChange,
  onDelete,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;
    }
  }, [isEditing]);

  return (
    <Box p={5} w="full" cursor={isEditing ? "default" : "pointer"}>
      <Flex alignItems="center">
        {isEditing ? (
          <>
            <Input
              value={title}
              onChange={(e) => onChange(id, "title", e.target.value)}
              mb={2}
            />
            <IconButton
              aria-label="Delete"
              icon={<Trash />}
              onClick={() => onDelete(id)}
              variant="outline"
              colorScheme="red"
              ml={2}
            />
          </>
        ) : (
          <Text fontWeight="bold" fontSize={"lg"} onClick={() => onClick(id)}>
            {title}
          </Text>
        )}
        <Box flex="1" borderBottom="2px" ml={2} />
      </Flex>
      {isEditing ? (
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(id, "content", e.target.value)}
          mt={4}
          p={5}
          borderRadius="30"
          bg="#EEEEEE"
          resize="block"
          overflow="hidden"
          whiteSpace="pre-wrap"
        />
      ) : (
        <Box
          bg="#EEEEEE"
          mt={4}
          p={5}
          borderRadius="30"
          onClick={() => onClick(id)}
          whiteSpace="pre-wrap"
        >
          <Text>{content}</Text>
        </Box>
      )}
    </Box>
  );
};

export default TextSection;
