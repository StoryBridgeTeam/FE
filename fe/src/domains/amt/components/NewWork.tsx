import {
  Text,
  Flex,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getNetwork } from "../api/AmtAPI";
import { useLocation, useParams } from "react-router-dom";

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
      p={6}
      shadow="lg"
      borderRadius="3xl"
      mt={"40px"}
      width={isMobile ? "100% " : "400px"}
      h="240px"
      border={"1px solid"}
      borderColor={"gray.200"}
      alignItems={"center"}
      justifyContent={"space-between"}
      direction={"column"}
    >
      <Box
        w={"200px"}
        h={"30px"}
        mb={4}
        textAlign={"center"}
        borderRadius="xl"
        border={"1px solid"}
        borderColor={"gray.200"}
        shadow="lg"
      >
        <Text fontWeight={"bold"} color={"gray.700"}>
          Activity 지수
        </Text>
      </Box>
      <Flex w={"100%"} alignItems={"center"} justifyContent={"space-around"}>
        <CircularProgress
          value={network?.monthlyTotalPoint}
          size={"120px"}
          color={"gray.400"}
        >
          <CircularProgressLabel fontSize={"20px"} color={"blue.700"}>
            총 점수
            <br />
            {network?.monthlyTotalPoint}
          </CircularProgressLabel>
        </CircularProgress>
        <Box ml={4} textAlign={"left"}>
          <Text fontSize={"lg"} fontWeight={"semibold"} color={"gray.600"}>
            온라인 활동 {network?.monthlyTotalOnlinePoint}점
          </Text>
          {/* <AvatarGroup size="sm" max={6} mb={2}>
            <Avatar name="Profile 1" src="https://bit.ly/dan-abramov" />
            <Avatar name="Profile 2" src="https://bit.ly/ryan-florence" />
            <Avatar name="Profile 3" src="https://bit.ly/kent-c-dodds" />
            <Avatar name="Profile 4" src="https://bit.ly/prosper-baba" />
            <Avatar name="Profile 5" src="https://bit.ly/code-beast" />
            <Avatar name="Profile 6" src="https://bit.ly/sage-adebayo" />
            <Text fontSize="lg" ml={2} color="gray.600">
              ...
            </Text>
          </AvatarGroup> */}

          <Text fontSize={"lg"} fontWeight={"semibold"} color={"gray.600"}>
            오프라인 활동 {network?.monthlyTotalOfflinePoint}점
          </Text>

          {/* <AvatarGroup size="sm" max={6} mb={2}>
            <Avatar name="Profile 1" src="https://bit.ly/dan-abramov" />
            <Avatar name="Profile 2" src="https://bit.ly/ryan-florence" />
            <Avatar name="Profile 3" src="https://bit.ly/kent-c-dodds" />
            <Avatar name="Profile 4" src="https://bit.ly/prosper-baba" />
            <Avatar name="Profile 5" src="https://bit.ly/code-beast" />
            <Avatar name="Profile 6" src="https://bit.ly/sage-adebayo" />
            <Text fontSize="lg" ml={2} color="gray.600">
              ...
            </Text>
          </AvatarGroup> */}
        </Box>
      </Flex>
    </Flex>
  );
};

export default NetWork;
