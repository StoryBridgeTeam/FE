import React, { useState } from "react";
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
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { SlideUpSmallModal } from "../../../common/components/SlideUpSmallModal";
import { ancestors, cards } from "./data";
import { ChevronRightIcon } from "@chakra-ui/icons";

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
      cursor={"pointer"}
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
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAncestor, setSelectedAncestor] = useState<Ancestor | null>(
    null
  );
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const a: Ancestor = { name: "Ancestor", img: "/path/to/image.jpg" };

  const [descendants, setDescendants] = useState<Descendant[]>([
    { count: 17, profile: [] },
    { count: 31, profile: [] },
  ]);

  const maxCount = Math.max(...descendants.map((d) => d.count));

  const handleMouseEnter = (ancestor: Ancestor, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredAncestor({
      ...ancestor,
      top: rect.top + window.scrollY + 20,
      left: rect.left + window.scrollX - 30,
    });
  };

  const handleMouseLeave = () => {
    setHoveredAncestor(null);
  };

  const handleAvatarClick = (ancestor: Ancestor) => {
    if (isMobile) {
      setSelectedAncestor(ancestor);
      onOpen();
    } else {
      const url = `/${ancestor.name}`;
      const searchParams = new URLSearchParams();

      if (token) {
        searchParams.append("token", token);
      }

      navigate(`${url}?${searchParams.toString()}`, { replace: true });
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
      width={isMobile ? "100%" : "70%"}
      align="center"
      px={isMobile ? 5 : undefined}
      ml={isMobile ? undefined : 10}
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

        <Box position="relative" mb={5} pr={20}>
          <Flex
            overflowX="auto"
            whiteSpace="nowrap"
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
            }}
            pr={"30px"}
          >
            {ancestors.map((ancestor, index) => (
              <Box key={index} mr={5}>
                <HStack spacing={1}>
                  <ProfileAvatar
                    ancestor={ancestor}
                    onHover={handleMouseEnter}
                    onLeave={handleMouseLeave}
                    onClick={() => handleAvatarClick(ancestor)}
                  />
                  {index === ancestors.length - 1 && (
                    <Text fontSize="md" fontWeight="bold" ml={3}>
                      ...
                    </Text>
                  )}
                </HStack>
              </Box>
            ))}
          </Flex>

          <Box
            position="absolute"
            top={0}
            right={20}
            height="100%"
            width="40px"
            bgGradient="linear(to-l, rgba(255,255,255,0.7), transparent)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
            zIndex={1}
          >
            <Icon ml={20} as={ChevronRightIcon} boxSize={6} color="gray.600" />
          </Box>
        </Box>

        <VStack spacing={5} align="stretch" width="100%" mb={5}>
          {descendants.map((descendant, index) =>
            descendant.profile.length === 0 ? (
              <HStack key={index} spacing={4} onClick={() => barClick(index)}>
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
              <Box position="relative" pr={20}>
                <Flex
                  overflowX="auto"
                  whiteSpace="nowrap"
                  sx={{
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                  }}
                  pr={"30px"}
                >
                  {ancestors.map((ancestor, index) => (
                    <Box key={index} mr={5}>
                      <HStack spacing={1}>
                        <ProfileAvatar
                          ancestor={ancestor}
                          onHover={handleMouseEnter}
                          onLeave={handleMouseLeave}
                          onClick={() => handleAvatarClick(ancestor)}
                        />
                        {index === ancestors.length - 1 && (
                          <Text fontSize="md" fontWeight="bold" ml={3}>
                            ...
                          </Text>
                        )}
                      </HStack>
                    </Box>
                  ))}
                </Flex>

                <Box
                  position="absolute"
                  top={0}
                  right={20}
                  height="100%"
                  width="40px"
                  bgGradient="linear(to-l, rgba(255,255,255,0.7), transparent)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  pointerEvents="none"
                  zIndex={1}
                >
                  <Icon
                    ml={20}
                    as={ChevronRightIcon}
                    boxSize={6}
                    color="gray.600"
                  />
                </Box>
              </Box>
            )
          )}
        </VStack>
        <Box
          border={"1px solid"}
          borderColor={"gray.300"}
          shadow="lg"
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
            onClick={() => navigate(`/${selectedAncestor.name}`)}
          >
            <UnorderedList>
              {cards.map((card) => (
                <ListItem key={card.id} display="flex">
                  <Text as="span" fontWeight="bold" fontSize="sm" mr={2}>
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
