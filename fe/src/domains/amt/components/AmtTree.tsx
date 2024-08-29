import React, { useEffect, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  useBreakpointValue,
  Heading,
  UnorderedList,
  ListItem,
  Flex,
  Icon,
  useDisclosure,
  IconButton,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SlideUpSmallModal } from "../../../common/components/SlideUpSmallModal";
import { Card, ProfileAvatar } from "../utils/data";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { amtBlock, getAmt } from "../api/AmtAPI";
import { data, Data, DataNode } from "../utils/atmUtils";
import { getCard } from "../../info/api/SideBarAPI";
import { MdBlock } from "react-icons/md";
import { useToastMessage } from "../../../common/hooks/useToastMessage";

const AmtTree = () => {
  const { showToast } = useToastMessage();
  const [hoveredAncestor, setHoveredAncestor] = useState<DataNode | null>(null);
  const [isHoveringCard, setIsHoveringCard] = useState<boolean>(false); // New state to track if hovering over card
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAncestor, setSelectedAncestor] = useState<DataNode | null>(
    null
  );
  const [isbar, setbar] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { nickName } = useParams<{ nickName: string }>();
  const [amt, setAmt] = useState<Data>();
  const [cards, setCards] = useState<Card[]>();
  const name = localStorage.getItem("nickName");
  const ishost = name === nickName;
  useEffect(() => {
    const getfetchAmt = async () => {
      let data;
      if (token) {
        data = await getAmt(nickName!, token);
      } else data = await getAmt(nickName!);

      setAmt(data);
    };

    getfetchAmt();
  }, [token, nickName]);

  const fetchCard = async (name: string) => {
    let data;
    if (token) {
      data = await getCard(name, token);
    } else data = await getCard(name);
    console.log(data);
    setCards(data);
  };

  useEffect(() => {
    if (selectedAncestor) {
      fetchCard(selectedAncestor!.nickname);
    }

    if (hoveredAncestor && !isHoveringCard) {
      fetchCard(hoveredAncestor!.nickname);
    }
  }, [selectedAncestor, hoveredAncestor, isHoveringCard]);

  const handleMouseEnter = (ancestor: DataNode, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredAncestor({
      ...ancestor,
      top: rect.top + window.scrollY - 10,
      left: rect.left + window.scrollX - 50,
    });
  };

  const handleMouseLeave = () => {
    if (!isHoveringCard) {
      setHoveredAncestor(null);
    }
  };

  const handleAvatarClick = (ancestor: DataNode) => {
    if (isMobile) {
      setSelectedAncestor(ancestor);
      onOpen();
    } else {
      const url = `/${ancestor.nickname}`;
      const searchParams = new URLSearchParams();

      if (token) {
        searchParams.append("token", token);
      }

      navigate(`${url}?${searchParams.toString()}`, { replace: true });
    }
  };

  const blockUser = async (nickname: string) => {
    try {
      await amtBlock(nickname);
      showToast("유저 차단 성공", "차단에 성공했습니다", "success");
    } catch {
      showToast("유저 차단 실패", "차단에 실패했습니다", "error");
    }
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
        {amt?.root && (
          <HStack spacing={1} mb={5}>
            <ProfileAvatar
              ancestor={amt?.root || data}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
              onClick={() => handleAvatarClick(amt!.root)}
            />
          </HStack>
        )}

        {amt?.levelOneNode && (
          <HStack spacing={1} mb={5}>
            <ProfileAvatar
              ancestor={amt?.levelOneNode || data}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
              onClick={() => handleAvatarClick(amt!.levelOneNode)}
            />
          </HStack>
        )}

        <Text fontSize="md" fontWeight={"bold"} mt={-2} mb={2} ml={5}>
          ⋮
        </Text>

        {amt?.parent && (
          <HStack spacing={1} mb={5}>
            <ProfileAvatar
              ancestor={amt?.parent || data}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
              onClick={() => handleAvatarClick(amt!.parent)}
            />
          </HStack>
        )}

        <HStack spacing={1} mb={5}>
          <ProfileAvatar
            ancestor={amt?.target || data}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
            onClick={() => handleAvatarClick(amt!.target)}
          />
        </HStack>

        {amt?.child.length !== 0 && (
          <Box position="relative" mb={5} pr={isMobile ? 5 : 20}>
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
              {amt?.child.map((ancestor, index) => (
                <Box key={index} mr={5}>
                  <HStack spacing={1}>
                    <ProfileAvatar
                      ancestor={ancestor}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                      onClick={() => handleAvatarClick(ancestor)}
                    />
                    {index === amt?.child.length - 1 && (
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
              right={isMobile ? 0 : 20}
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
                ml={isMobile ? 5 : 20}
                as={ChevronRightIcon}
                boxSize={6}
                color="gray.600"
              />
            </Box>
          </Box>
        )}

        {isbar ? (
          <HStack spacing={4} onClick={() => setbar(false)} mb={5}>
            <Box
              bg="blackAlpha.800"
              height="30px"
              width={`70%`}
              borderRightRadius="3xl"
              position="relative"
            ></Box>
            <Text fontSize="sm" pr="1px">
              {amt?.twoLevelChildCount}
            </Text>
          </HStack>
        ) : (
          <Box position="relative" mb={5} pr={isMobile ? 5 : 20}>
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
              {amt?.twoLevelChild.map((ancestor, index) => (
                <Box key={index} mr={5}>
                  <HStack spacing={1}>
                    <ProfileAvatar
                      ancestor={ancestor}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                      onClick={() => handleAvatarClick(ancestor)}
                    />
                    {index === amt?.twoLevelChild.length - 1 && (
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
              right={isMobile ? 0 : 20}
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
                ml={isMobile ? 5 : 20}
                as={ChevronRightIcon}
                boxSize={6}
                color="gray.600"
              />
            </Box>
          </Box>
        )}

        <Box
          border={"1px solid"}
          borderColor={"gray.300"}
          shadow="lg"
          height={"150px"}
          w={isMobile ? "100%" : "90%"}
          textAlign={"center"}
          lineHeight={"150px"}
          borderRadius={"30px"}
        >
          {amt?.totalChildCount} 명이 초대받아 사용 중입니다.
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
            shadow="3xl"
          >
            <Box
              width="100%"
              mx="auto"
              p={4}
              bg="white"
              shadow="md"
              borderRadius="3xl"
              position="relative"
              onMouseEnter={() => setIsHoveringCard(true)}
              onMouseLeave={() => setIsHoveringCard(false)}
            >
              {ishost && (
                <IconButton
                  aria-label="Block user"
                  icon={<MdBlock />}
                  position="absolute"
                  top={2}
                  right={2}
                  size="sm"
                  fontSize={"lg"}
                  color={"red"}
                  bg={"white"}
                  onClick={() => blockUser(hoveredAncestor.nickname)}
                />
              )}
              <VStack align="stretch" spacing={2} color="black">
                <Heading size="sm" textAlign="center">
                  {hoveredAncestor.nickname}
                </Heading>
                <Box border="1px dashed black" borderRadius="xl" p={4} h="100%">
                  <UnorderedList>
                    {cards?.length !== 0 ? (
                      cards?.map((card) => (
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
                      ))
                    ) : (
                      <>명함이 등록되지 않은 사용자입니다.</>
                    )}
                  </UnorderedList>
                </Box>
              </VStack>
            </Box>
          </Box>
        )}
      </Box>

      {selectedAncestor && (
        <SlideUpSmallModal
          isOpen={isOpen}
          onClose={onClose}
          title={selectedAncestor.nickname}
        >
          {ishost && (
            <IconButton
              aria-label="Block user"
              icon={<MdBlock />}
              position="absolute"
              top={4}
              right={50}
              size="sm"
              fontSize={"lg"}
              color={"red"}
              bg={"white"}
              onClick={() => blockUser(selectedAncestor.nickname)}
            />
          )}
          <Box
            mt={-5}
            border="1px dashed black"
            borderRadius="xl"
            p={2}
            h="120%"
            onClick={() => navigate(`/${selectedAncestor.nickname}`)}
          >
            <UnorderedList>
              {cards?.length !== 0 ? (
                cards?.map((card) => (
                  <ListItem key={card.id} display="flex" mb={2}>
                    <Text as="span" fontWeight="bold" fontSize="sm" mr={2}>
                      {card.title}:
                    </Text>
                    <Text as="span" fontSize="sm">
                      {card.content}
                    </Text>
                  </ListItem>
                ))
              ) : (
                <>명함이 등록되지 않은 사용자입니다.</>
              )}
            </UnorderedList>
          </Box>
        </SlideUpSmallModal>
      )}
    </VStack>
  );
};

export default AmtTree;
