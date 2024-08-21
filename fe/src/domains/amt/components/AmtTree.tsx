import React, { useState, useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  useBreakpointValue,
  GridItem,
  Avatar,
  Heading,
  UnorderedList,
  ListItem,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SlideUpSmallModal } from "../../../common/components/SlideUpSmallModal";

interface Ancestor {
  name: string;
  img: string;
  top?: number;
  left?: number;
}

interface Descendant {
  count: number;
  profile: Ancestor[];
}

interface ProfileAvatarProps {
  ancestor: Ancestor;
  onHover: (ancestor: Ancestor, event: React.MouseEvent) => void;
  onLeave: () => void;
  onClick: () => void;
}

const ProfileAvatar = ({
  ancestor,
  onHover,
  onLeave,
  onClick,
}: ProfileAvatarProps) => {
  return (
    <Avatar
      name={ancestor.name}
      src={ancestor.img}
      size="md"
      onMouseEnter={(event) => onHover(ancestor, event)}
      onMouseLeave={onLeave}
      onClick={onClick}
    />
  );
};

const AmtTree = () => {
  const [hoveredAncestor, setHoveredAncestor] = useState<Ancestor | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAncestor, setSelectedAncestor] = useState<Ancestor | null>(
    null
  );
  const navigate = useNavigate();

  const a: Ancestor = { name: "Ancestor", img: "/path/to/image.jpg" };
  const ancestors: Ancestor[] = [
    { name: "Ancestor 1", img: "/path/to/image1.jpg" },
    { name: "Ancestor 2", img: "/path/to/image2.jpg" },
    { name: "Ancestor 3", img: "/path/to/image3.jpg" },
    { name: "Ancestor 4", img: "/path/to/image4.jpg" },
    { name: "Ancestor 5", img: "/path/to/image5.jpg" },
  ];

  const cards = [
    {
      id: 1,
      title: "직업",
      content: "마케팅 매니저",
    },
    {
      id: 2,
      title: "회사",
      content: "ABC 주식회사 (ABC Corp.)",
    },
    {
      id: 3,
      title: "전화",
      content: "010-1234-5678",
    },
    {
      id: 4,
      title: "이메일",
      content: "gil.dong@example.com",
    },
    {
      id: 5,
      title: "주소",
      content: "서울특별시 강남구 테헤란로 ***",
    },
    {
      id: 6,
      title: "웹사이트",
      content: "www.example.com",
    },
  ];

  const [descendants, setDescendants] = useState<Descendant[]>([
    { count: 17, profile: [] },
    { count: 31, profile: [] },
    { count: 76, profile: [] },
  ]);
  const maxCount = Math.max(...descendants.map((d) => d.count));

  const handleMouseEnter = (ancestor: Ancestor, event: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const rect = event.currentTarget.getBoundingClientRect();
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredAncestor({
        ...ancestor,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX - 80,
      });
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredAncestor(null);
    }, 200);
  };

  const handleAvatarClick = (ancestor: Ancestor) => {
    if (isMobile) {
      setSelectedAncestor(ancestor);
      onOpen();
    } else {
      navigate(`/${ancestor.name}`);
    }
  };

  const barClick = (index: number) => {
    const updatedDescendants = [...descendants];
    updatedDescendants[index].profile = ancestors;
    setDescendants(updatedDescendants);
  };

  return (
    <VStack
      spacing={3}
      width={isMobile ? "90%" : "70%"}
      align="center"
      ml={isMobile ? 5 : 20}
      position="relative"
    >
      <Box
        alignSelf="flex-start"
        marginRight="auto"
        mt={10}
        position="relative"
        width={"100%"}
      >
        <HStack spacing={1}>
          <ProfileAvatar
            ancestor={a}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
            onClick={() => handleAvatarClick(a)}
          />
        </HStack>

        <Text fontSize="md" fontWeight={"bold"} mb={2} ml={5}>
          ⋮
        </Text>

        <HStack spacing={1} mb={5}>
          <ProfileAvatar
            ancestor={a}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
            onClick={() => handleAvatarClick(a)}
          />
        </HStack>

        <HStack spacing={1} mb={5}>
          <ProfileAvatar
            ancestor={{ name: "admin", img: "/your/image.jpg" }}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
            onClick={() =>
              handleAvatarClick({ name: "admin", img: "/your/image.jpg" })
            }
          />
        </HStack>

        <Flex
          mb={5}
          overflowY="scroll"
          sx={{
            "::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          {ancestors.map((ancestor, index) => (
            <GridItem key={index} mr={5}>
              <HStack spacing={1}>
                <ProfileAvatar
                  ancestor={ancestor}
                  onHover={handleMouseEnter}
                  onLeave={handleMouseLeave}
                  onClick={() => handleAvatarClick(ancestor)}
                />
                {index === ancestors.length - 1 && (
                  <Text fontSize="md" fontWeight={"bold"} ml={3}>
                    ...
                  </Text>
                )}
              </HStack>
            </GridItem>
          ))}
        </Flex>

        <VStack spacing={5} align="stretch" width="100%" mb={5}>
          {descendants.map((descendant, index) =>
            descendant.profile.length === 0 ? (
              <HStack
                key={index}
                spacing={4}
                onClick={() => {
                  barClick(index);
                }}
              >
                <Box
                  bg="blackAlpha.800"
                  height="30px"
                  width={`${(descendant.count / maxCount) * 100}%`}
                  borderRightRadius="3xl"
                  position="relative"
                ></Box>
                <Text fontSize="sm" pr="1px">
                  {descendant.count}
                </Text>
              </HStack>
            ) : (
              <Flex
                overflowY="scroll"
                sx={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                  scrollbarWidth: "none",
                }}
              >
                {" "}
                {descendant.profile.map((ancestor, index) => (
                  <GridItem key={index} mr={5}>
                    <HStack>
                      <ProfileAvatar
                        ancestor={ancestor}
                        onHover={handleMouseEnter}
                        onLeave={handleMouseLeave}
                        onClick={() => handleAvatarClick(ancestor)}
                      />
                    </HStack>
                  </GridItem>
                ))}
              </Flex>
            )
          )}
        </VStack>
        <Box
          border={"1px solid black"}
          height={"150px"}
          w={"100%"}
          textAlign={"center"}
          lineHeight={"150px"}
          borderRadius={"30px"}
        >
          31,189,154 명이 함께 이용 중입니다.
        </Box>

        {/* Hover Card */}
        {hoveredAncestor && !isMobile && (
          <Box
            position="absolute"
            top={`${hoveredAncestor.top}px`}
            left={`${hoveredAncestor.left}px`}
            transform="translateX(30px) translateY(-50%)"
            zIndex={10}
            width="400px"
            shadow={"3xl"}
          >
            <Box
              width="100%"
              mx="auto"
              p={4}
              bg="white"
              shadow="md"
              borderRadius="3xl"
            >
              <VStack align="stretch" spacing={2} color="black">
                <Heading size="sm" textAlign="center">
                  {hoveredAncestor.name}
                </Heading>
                <Box border="1px dashed black" borderRadius="xl" p={4} h="100%">
                  <UnorderedList>
                    {cards.map((card) => (
                      <ListItem key={card.id} display="flex">
                        <Text
                          as="span"
                          fontWeight="bold"
                          fontSize="sm"
                          width="20%"
                          mr={2}
                        >
                          {card.title}:
                        </Text>
                        <Text as="span" fontSize="sm">
                          {card.content}
                        </Text>
                      </ListItem>
                    ))}
                  </UnorderedList>
                </Box>
              </VStack>
            </Box>
          </Box>
        )}
      </Box>

      {/* Mobile Modal */}
      {selectedAncestor && (
        <SlideUpSmallModal
          isOpen={isOpen}
          onClose={onClose}
          title={selectedAncestor.name}
        >
          <Box
            mt={-5}
            border="1px dashed black"
            borderRadius="xl"
            p={2}
            h="120%"
            onClick={() => {
              navigate(`/${selectedAncestor.name}`);
            }}
          >
            <UnorderedList>
              {cards.map((card) => (
                <ListItem key={card.id} display="flex">
                  <Text
                    as="span"
                    fontWeight="bold"
                    fontSize="sm"
                    mr={2}
                  >
                    {card.title}:
                  </Text>
                  <Text as="span" fontSize="sm">
                    {card.content}
                  </Text>
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        </SlideUpSmallModal>
      )}
    </VStack>
  );
};

export default AmtTree;
