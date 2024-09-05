import React, { useRef, useEffect } from "react";
import { VStack, Box, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface ProfileImage {
  id: number;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

interface Member {
  nickname: string;
  profileImage: ProfileImage;
}

interface SearchResultsProps {
  content: Member[];
  setObserver: (node: HTMLDivElement | null) => void;
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  content,
  setObserver,
  onClose,
}) => {
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (lastItemRef.current) {
      setObserver(lastItemRef.current);
    }
  }, [setObserver, content]);

  const handleClick = (nickname: string) => {
    navigate(`/${nickname}`);
    onClose();
  };

  return (
    <VStack
      spacing={2}
      mt={2}
      p={4}
      w="full"
      bg="white"
      borderRadius="md"
      boxShadow="md"
      height="270px"
      overflowY="auto"
    >
      {content.length === 0 ? (
        <Box w="full" textAlign="center" p={4}>
          <Text>검색 결과가 존재하지 않습니다.</Text>
        </Box>
      ) : (
        content.map((member, index) => (
          <Box
            key={index}
            p={2}
            w="full"
            borderBottom="1px solid #E2E8F0"
            display="flex"
            alignItems="center"
            ref={index === content.length - 1 ? lastItemRef : null}
            onClick={() => handleClick(member.nickname)}
            _hover={{ cursor: "pointer", bg: "gray.100" }}
          >
            <Image
              boxSize="40px"
              borderRadius="full"
              src={
                member?.profileImage?.path
                  ? `http://image.storyb.kr/${member.profileImage.path}`
                  : "/images/profile.png"
              }
              alt={member.nickname}
              mr={6}
            />
            <Text>{member.nickname}</Text>
          </Box>
        ))
      )}
    </VStack>
  );
};

export default SearchResults;
