import {
  Text,
  Flex,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Avatar,
  AvatarGroup,
  useBreakpointValue, VStack, HStack, Stat, StatNumber, StatLabel, StatHelpText, StatArrow,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getNetwork } from "../api/AmtAPI";
import {useLocation, useNavigate, useParams} from "react-router-dom";

interface ProfileImage {
  id: number;
  name: string;
  contentType: string;
  size: number;
  path: string;
}

interface ActivistDetails {
  activistId: number | null;
  monthlyTotalPoint: number;
  monthlyTotalOnlinePoint: number;
  monthlyTotalOfflinePoint: number;
  activistNickname: string;
  profileImage: ProfileImage;
}

interface NetWorkPoint {
  monthlyTotalPoint: number;
  monthlyTotalOnlinePoint: number;
  monthlyTotalOfflinePoint: number;
  mostActivityDetails: ActivistDetails[];
}

const NetWork = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { nickName } = useParams<{ nickName: string }>();
  const location = useLocation();
  const [network, setNetwork] = useState<NetWorkPoint>();

  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  useEffect(() => {
    const fetchNetwork = async () => {
      let data;
      if (token) {
        data = await getNetwork(nickName!, token);
      } else {
        data = await getNetwork(nickName!);
      }

      setNetwork(data);
    };

    fetchNetwork();
  }, []);
  return (
    <Flex
      p={4}
      // shadow="lg"
      borderRadius="3xl"
      border={"1px solid"}
      borderColor={"gray.200"}
      alignItems={"center"}
      justifyContent={"start"}
      direction={"column"}
      gap={4}
      boxSizing={"border-box"}
      mb={isMobile?5:"none"}
      flexWrap={"wrap"}
      minW={"400px"}
      maxW={"500px"}
    >
      <Text fontWeight={"bold"} color={"gray.700"} paddingX={10} paddingY={2}
            textAlign={"center"}
            borderRadius="xl"
            border={"1px solid"}
            borderColor={"gray.200"}
      >
        Activity 지수
      </Text>
      <Flex direction={"row"} gap={2} justifyContent={"space-between"} w={"100%"}
            flexWrap={"wrap"}
      >
        <Box>
          <CircularProgress
              value={network?.monthlyTotalPoint}
              size={"180px"}
              color={"gray.400"}
          >
            <CircularProgressLabel fontSize={"13px"} color={"blue.700"} fontWeight={"bold"}>
              온라인 {network?.monthlyTotalOnlinePoint}점
              <br />
              오프라인 {network?.monthlyTotalOfflinePoint}점
              <br />
              총 점수 {network?.monthlyTotalPoint}점
            </CircularProgressLabel>
          </CircularProgress>
        </Box>
        <VStack justifyContent={"start"} alignItems={"center"} gap={1} overflowY={"auto"} maxH={"250px"}>
          {
            network &&
            network.mostActivityDetails.map(n =>
                  <HStack gap={5} _hover={{cursor:"pointer", bgColor:"gray.200"}} paddingX={2} paddingY={1} borderRadius={10}
                          onClick={() => token ? navigate(`/${n.activistNickname}?token=${token}`) :  navigate(`/${n.activistNickname}`)}
                  >
                    <Avatar
                        border={"0.5px solid grey"}
                        src={
                          n.profileImage
                              ? `http://image.storyb.kr/${n.profileImage.path}`
                              : `/images/profile.png`
                        }
                        size="sm"
                    />
                    <Stat >
                      <StatNumber fontSize={16}>{n.activistNickname}</StatNumber>
                      <StatHelpText fontSize={10}>
                        온라인 {n.monthlyTotalOnlinePoint}점 / 오프라인 {n.monthlyTotalOfflinePoint}점
                      </StatHelpText>
                    </Stat>
                  </HStack>
            )
          }
        </VStack>
      </Flex>
    </Flex>
  );
};

export default NetWork;
