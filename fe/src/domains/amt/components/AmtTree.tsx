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
  Spinner, Avatar,
} from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SlideUpSmallModal } from "../../../common/components/SlideUpSmallModal";
import { Card, ProfileAvatar } from "../utils/data";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {amtBlock, amtBlockReset, getAmt, userBlock, userUnBlock} from "../api/AmtAPI";
import { data, Data, DataNode } from "../utils/atmUtils";
import { getCard } from "../../info/api/SideBarAPI";
import { MdBlock } from "react-icons/md";
import { useToastMessage } from "../../../common/hooks/useToastMessage";
import UnblockUserModal from "./UnBlockUserModal";
import {randomUUID} from "crypto";

const AmtTree = () => {
  const {
    isOpen: isOpenBlock,
    onOpen: onOpenBlock,
    onClose: onCloseBlock,
  } = useDisclosure();

  const { showToast } = useToastMessage();
  const [blockAncestor, setBlockAncestor] = useState<DataNode | null>(null);
  const [hoveredAncestor, setHoveredAncestor] = useState<DataNode | null>(null);
  const [isHoveringCard, setIsHoveringCard] = useState<boolean>(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAncestor, setSelectedAncestor] = useState<DataNode | null>(
    null
  );
  const [isbar, setbar] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { nickName } = useParams<{ nickName: string }>();
  const [amt, setAmt] = useState<Data>();
  const [cards, setCards] = useState<Card[]>();
  const [isLoading, setIsLoading] = useState(false);
  const name = localStorage.getItem("nickName");
  const ishost = name === nickName;

  const MAXIMUM_LIST = [10, 100, 500, 1000, 5000, 10000, 100000];
  const LIMIT = () => {
    if(amt){
      const maxCount = Math.max((amt.child.length, amt.twoLevelChildCount));
      const limit = Math.min(...MAXIMUM_LIST.filter(num => num>maxCount));
      return limit;
    }

    return 10;
  }

  const getfetchAmt = async () => {
    let data;
    if (token) {
      data = await getAmt(nickName!, token);
    } else data = await getAmt(nickName!);

    setAmt(data);
  };

  const handleUserBlock = async (nickname:string) => {
    try {
      await userBlock(nickname);
      getfetchAmt();
      showToast("유저 차단 성공", "해당 유저는 본인의 정보를 조회할 수 없습니다.", "success");
    } catch {
      showToast("유저 차단 실패", "차단에 실패했습니다", "error");
    }
  }

  const handleUserUnBlock = async (nickname:string) => {
    try {
      await userUnBlock(nickname);
      getfetchAmt();
      showToast("유저 차단 해제 성공", "해당 유저는 본인의 정보를 조회할 수 있습니다.", "success");
    } catch {
      showToast("유저 차단 해제 실패", "차단 해제에 실패했습니다", "error");
    }
  }

  useEffect(() => {
    getfetchAmt();
  }, [token, nickName]);

  const fetchCard = async (name: string) => {
    setIsLoading(true);
    try {
      let data;
      if (token) {
        data = await getCard(name, token);
      } else data = await getCard(name);
      console.log(data);
      setCards(data);
    } finally {
      setIsLoading(false);
    }
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
    if (!ishost && ancestor.isBlocked) return;

    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredAncestor({
      ...ancestor,
      top: rect.top + window.scrollY + 80 ,
      left: rect.left + window.scrollX ,
    });
  };

  const handleUnhideUser = async (nickname : string) => {
    try {
      await amtBlockReset(nickname);
      getfetchAmt();
      showToast("유저 보이기 성공", "다른사람은 AMT에서 해당 유저를 다시 볼 수 있습니다.", "success");
    } catch {
      showToast("유저 보이기 실패", "보이기에 실패했습니다", "error");
    }
  };

  const handleMouseLeave = () => {
    if (!isHoveringCard) {
      setHoveredAncestor(null);
    }
  };

  const handleAvatarClick = (ancestor: DataNode) => {
    if (ancestor.nickname==null) return;
    // if (!ishost && ancestor.isBlocked) return;

    if (isMobile) {
      setSelectedAncestor(ancestor);
      onOpen();
    } else {
      const url = `/${ancestor.nickname}`;
      const searchParams = new URLSearchParams();

      if (token) {
        searchParams.append("token", token);
      }

      navigate(`${url}?${searchParams.toString()}`);
    }
  };

  const getRandom = (min:number, max:number) => Math.floor(Math.random() * (max - min) + min);

  const hideUser = async (nickname: string) => {
    try {
      await amtBlock(nickname);
      getfetchAmt();
      showToast("유저 가리기 성공", "다른사람은 AMT에서 해당 유저를 볼 수 없습니다.", "success");
    } catch {
      showToast("유저 가리기 실패", "가리기에 실패했습니다", "error");
    }
  };

  return (
    <VStack
        flex={4}
      spacing={3}
      // width={isMobile ? "100%" : "85%"}
      maxW={"1000px"}
      minW={"380px"}
      align="center"
      // px={isMobile ? 5 : undefined}
      // position="relative"
    >
      <Flex
          direction={"column"}
          gap={2}
        // alignSelf="flex-start"
        // marginRight="auto"
        // position="relative"
        width={"100%"}
      >
        {(amt?.root && amt?.root.nickname!==amt?.target.nickname && amt?.root.nickname!==amt?.parent.nickname ) && (
          <HStack spacing={1} mb={5}>
            <ProfileAvatar
                blockUser={handleUserBlock}
                unblockUser={handleUserUnBlock}
                unHideUser={handleUnhideUser}
                isHost={ishost}
              hideUser={hideUser}
              ancestor={amt?.root}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
              onClick={() => handleAvatarClick(amt!.root)}
            />
          </HStack>
        )}

        {(amt?.levelOneNode && amt?.levelOneNode.nickname!==amt?.target.nickname && amt?.levelOneNode.nickname!==amt?.parent.nickname) && (
          <HStack spacing={1} mb={5}>
            <ProfileAvatar
                blockUser={handleUserBlock}
                unblockUser={handleUserUnBlock}
                unHideUser={handleUnhideUser}
                isHost={ishost}
                hideUser={hideUser}
              ancestor={amt?.levelOneNode}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
              onClick={() => handleAvatarClick(amt!.levelOneNode)}
            />
          </HStack>
        )}


        {
            ((amt?.root && amt?.root.nickname!==amt?.target.nickname && amt?.root.nickname!==amt?.parent.nickname) && amt?.levelOneNode
                && amt.levelOneNode.nickname!==amt?.target.nickname
            )&& (
                <Text fontSize="md" fontWeight={"bold"} mt={-2} mb={2} ml={5}>
                  ⋮
                </Text>
            )
        }

        {(amt?.parent) && (
          <HStack spacing={1} mb={5}>
            <ProfileAvatar
                blockUser={handleUserBlock}
                unblockUser={handleUserUnBlock}
                isHidable={true}
                unHideUser={handleUnhideUser}
                isHost={ishost}
                hideUser={hideUser}
              ancestor={amt?.parent}
              onHover={handleMouseEnter}
              onLeave={handleMouseLeave}
              onClick={() => handleAvatarClick(amt!.parent)}
            />
          </HStack>
        )}

        <HStack spacing={1} mb={5}>
          <ProfileAvatar
              blockUser={handleUserBlock}
              unblockUser={handleUserUnBlock}
              unHideUser={handleUnhideUser}
              isHost={ishost}
              hideUser={hideUser}
              isAmtOwner={true}
            ancestor={amt?.target || data}
            onHover={handleMouseEnter}
            onLeave={handleMouseLeave}
            onClick={() => handleAvatarClick(amt!.target)}
          />
        </HStack>

        {amt?.child.length !== 0 && (
          <Box
              // position="relative"
              mb={5} pr={isMobile ? 5 : 0}>
            <Flex
              overflowX="auto"
              whiteSpace="nowrap"
              sx={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
              }}
              // pr={"30px"}
              paddingY={1.5}
            >
              {amt?.child.map((ancestor, index) => (
                <Box key={index} mr={5}>
                  <HStack spacing={1}>
                    <ProfileAvatar
                        blockUser={handleUserBlock}
                        unblockUser={handleUserUnBlock}
                        isHidable={true}
                        unHideUser={handleUnhideUser}
                        isHost={ishost}
                        hideUser={hideUser}
                      ancestor={ancestor}
                      onHover={handleMouseEnter}
                      onLeave={handleMouseLeave}
                      onClick={() => handleAvatarClick(ancestor)}
                    />
                    {/*{index === amt?.child.length - 1 && (*/}
                    {/*  <Text fontSize="md" fontWeight="bold" ml={3}>*/}
                    {/*    ...*/}
                    {/*  </Text>*/}
                    {/*)}*/}
                  </HStack>
                </Box>
              ))}
            </Flex>
            {/*<Box*/}
            {/*  position="absolute"*/}
            {/*  top={0}*/}
            {/*  right={isMobile ? 0 : 20}*/}
            {/*  height="100%"*/}
            {/*  width="40px"*/}
            {/*  bgGradient="linear(to-l, rgba(255,255,255,0.7), transparent)"*/}
            {/*  display="flex"*/}
            {/*  alignItems="center"*/}
            {/*  justifyContent="center"*/}
            {/*  pointerEvents="none"*/}
            {/*  zIndex={1}*/}
            {/*>*/}
            {/*  <Icon*/}
            {/*    ml={isMobile ? 5 : 20}*/}
            {/*    as={ChevronRightIcon}*/}
            {/*    boxSize={6}*/}
            {/*    color="gray.600"*/}
            {/*  />*/}
            {/*</Box>*/}
          </Box>
        )}

        {/*{isbar && amt?.twoLevelChildCount ? (*/}
        {/*  <HStack spacing={4} onClick={() => setbar(false)} mb={5}>*/}
        {/*    <Box*/}
        {/*      bg="blackAlpha.800"*/}
        {/*      height="30px"*/}
        {/*      width={`${(amt.twoLevelChildCount / LIMIT()) * 100}%`}*/}
        {/*      borderRightRadius="3xl"*/}
        {/*      // position="relative"*/}
        {/*    ></Box>*/}
        {/*    <Text fontSize="sm" pr="1px">*/}
        {/*      {amt?.twoLevelChildCount}*/}
        {/*    </Text>*/}
        {/*  </HStack>*/}
        {/*) : (*/}
        {
          amt && amt?.totalChildCount>0 &&
            <Box
                // position="relative"
                mb={5} pr={isMobile ? 5 : 0}>
              <Flex
                  overflowX="auto"
                  whiteSpace="nowrap"
                  sx={{
                    "::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                  }}
                  // pr={"30px"}
                  paddingY={1.5}
              >
                {amt?.twoLevelChild.map((ancestor, index) => (
                    <Box key={index} mr={5}>
                      <HStack spacing={1}>
                        <ProfileAvatar
                            blockUser={handleUserBlock}
                            unblockUser={handleUserUnBlock}
                            unHideUser={handleUnhideUser}
                            isHost={ishost}
                            hideUser={hideUser}
                            ancestor={ancestor}
                            onHover={handleMouseEnter}
                            onLeave={handleMouseLeave}
                            onClick={() => handleAvatarClick(ancestor)}
                        />
                        {/*{index === amt?.twoLevelChild.length - 1 && (*/}
                        {/*  <Text fontSize="md" fontWeight="bold" ml={3}>*/}
                        {/*    ...*/}
                        {/*  </Text>*/}
                        {/*)}*/}
                      </HStack>
                    </Box>
                ))}
              </Flex>

              {/*<Box*/}
              {/*  position="absolute"*/}
              {/*  top={0}*/}
              {/*  right={isMobile ? 0 : 20}*/}
              {/*  height="100%"*/}
              {/*  width="40px"*/}
              {/*  bgGradient="linear(to-l, rgba(255,255,255,0.7), transparent)"*/}
              {/*  display="flex"*/}
              {/*  alignItems="center"*/}
              {/*  justifyContent="center"*/}
              {/*  pointerEvents="none"*/}
              {/*  zIndex={1}*/}
              {/*>*/}
              {/*  <Icon*/}
              {/*    ml={isMobile ? 5 : 20}*/}
              {/*    as={ChevronRightIcon}*/}
              {/*    boxSize={6}*/}
              {/*    color="gray.600"*/}
              {/*  />*/}
              {/*</Box>*/}
            </Box>
        }
        {/*)}*/}

        <Box
          borderColor={"gray.300"}
          height={"250px"}
          // w={isMobile ? "100%" : "500px"}
          textAlign={"center"}
          borderRadius={"30px"}
          position={"relative"}
          padding={2}
          overflow={"hidden"}
        >
          <HStack flexWrap={"wrap"}>
            {
              [...new Array(65)].map(_ =>
                  <Avatar
                      border={"0.5px solid grey"}
                      src={ `/images/profile.png` }
                      size="md"
                  />
              )
            }
          </HStack>
          <Flex
              background={"linear-gradient(to bottom, rgba(255,255,255, 0.5) 50%, rgba(255,255,255, 0.9) 75%, rgba(255,255,255, 0.9) 90%, white 100% )"}
              position={"absolute"}
              left={0}
              bottom={0}
              w={"100%"}
              h={"100%"}
              alignItems={"end"}
              justifyContent={"center"}
          >
            <Text
                fontSize={20}
                fontWeight={"bold"}
                padding={5}
            >
              {amt?.totalChildCount} 명이 초대받아 사용 중입니다.
            </Text>
          </Flex>
        </Box>

        {hoveredAncestor && !isMobile && (
          <Box
            position="absolute"
            top={`${hoveredAncestor.top}px`}
            left={`${hoveredAncestor.left}px`}
            transform="translateX(30px) translateY(-50%)"
            zIndex={10}
            width="400px"
            shadow="3xl"
            onMouseLeave={() => setHoveredAncestor(null)}
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
              <VStack align="stretch" spacing={2} color="black">
                {
                  hoveredAncestor.nickname==null ?
                      <Box border="1px dashed black" borderRadius="xl" p={4} h="100%">
                        조회할 수 없는 사용자 입니다.
                      </Box> :
                      <>
                        <Heading size="sm" textAlign="center">
                          {hoveredAncestor.nickname}
                        </Heading>
                        <Box border="1px dashed black" borderRadius="xl" p={4} h="100%">
                          {isLoading ? (
                              <Spinner size="sm" color="blue.500" />
                          ) : (
                              <UnorderedList>
                                {cards && cards.length > 0 ? (
                                    cards.map((card) => (
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
                          )}
                        </Box>
                      </>

                }
              </VStack>
            </Box>
          </Box>
        )}
      </Flex>
      {selectedAncestor && (
        <SlideUpSmallModal
          isOpen={isOpen}
          onClose={onClose}
          title={selectedAncestor.nickname}
        >
          <Box
            mt={-5}
            border="1px dashed black"
            borderRadius="xl"
            p={2}
            minH={"150px"}
            h="120%"
            onClick={() => navigate(`/${selectedAncestor.nickname}`)}
          >
            {isLoading ? (
              <Spinner size="sm" color="blue.500" />
            ) : (
              <UnorderedList>
                {cards && cards.length > 0 ? (
                  cards.map((card) => (
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
                  <Text mb={2}>명함이 등록되지 않은 사용자입니다.</Text>
                )}
              </UnorderedList>
            )}
          </Box>
        </SlideUpSmallModal>
      )}
      {/*<UnblockUserModal*/}
      {/*  isOpen={isOpenBlock}*/}
      {/*  onClose={onCloseBlock}*/}
      {/*  onConfirm={handleUnhideUser}*/}
      {/*/>*/}
    </VStack>
  );
};

export default AmtTree;
