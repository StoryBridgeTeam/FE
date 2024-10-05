import {
  Avatar,
  Box,
  useBreakpointValue,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAmt } from "../../amt/api/AmtAPI";
import { Data } from "../../amt/utils/atmUtils";

const NetworkStatus: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  const location = useLocation();
  const { nickName } = useParams<{ nickName: string }>();
  const [amt, setAmt] = useState<Data>();
  const [descendants, setDescendants] = useState<{ count: number }[]>([]);

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    const getfetchAmt = async () => {
      let data;
      if (token) {
        data = await getAmt(nickName!, token);
      } else {
        data = await getAmt(nickName!);
      }

      setAmt(data);

      // descendants 설정
      if (data) {
        setDescendants([
          { count: data.child.length || 0 },
          { count: data.twoLevelChildCount || 0 },
        ]);
      }
    };

    getfetchAmt();
  }, [nickName, token]);

  const maxCount = Math.max(...descendants.map((d) => d.count));
  const MAXIMUM_LIST = [10, 100, 500, 1000, 5000, 10000, 100000];
  const LIMIT = Math.min(...MAXIMUM_LIST.filter(num => num>maxCount));

  return (
    <Box
      _hover={{cursor:"pointer", bgColor:"gray.200"}}
      bg="#F6F6F6"
      borderRadius="3xl"
      h="100%"
      w="100%"
      p={4}
      color="#CDCDCD"
      border={isMobile ? "" : "1px solid"}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      onClick={() => {
        const url = `/${nickName}/amt`;
        const searchParams = new URLSearchParams();

        if (token) {
          searchParams.append("token", token);
        }

        navigate(`${url}?${searchParams.toString()}`);
      }}
    >
      <VStack
        align="flex-start"
        width="100%"
        color="black"
        flex="1"
        overflow="auto"
      >
        {
          amt?.parent &&
            <HStack spacing={1}>
              <Avatar
                  src={
                    amt?.parent?.profileImage
                        ? `${process.env.REACT_APP_IMAGE_SERVER}/${amt?.parent.profileImage.path}`
                        : "/images/profile.png"
                  }
                  size="sm"
              />
            </HStack>
        }
        <HStack spacing={1}>
          <Avatar
            src={
              amt?.target?.profileImage
                ? `${process.env.REACT_APP_IMAGE_SERVER}/${amt.target.profileImage.path}`
                : "/images/profile.png"
            }
            size="sm"
          />
        </HStack>
        <VStack align="stretch" width="90%">
          {descendants.map((descendant, index) => (
            <HStack key={index} spacing={2}>
              <Box
                bg="blackAlpha.800"
                height="15px"
                width={`${((descendant.count / LIMIT) * 100)==0 ? 1 : (descendant.count/LIMIT) *100}%`}
                borderRightRadius="3xl"
                position="relative"
              ></Box>
              <Text fontSize="sm" pr="1px">
                {descendant.count}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default NetworkStatus;
