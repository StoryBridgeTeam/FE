import {
  Avatar,
  Box,
  useBreakpointValue,
  VStack,
  Text,
  HStack,
} from "@chakra-ui/react";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const NetworkStatus: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  const location = useLocation();
  const { nickName } = useParams<{ nickName: string }>();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const ancestors = { name: "Ancestor 1", img: "/path/to/image1.jpg" };
  const descendants = [{ count: 17 }, { count: 31 }];

  const maxCount = Math.max(...descendants.map((d) => d.count));

  return (
    <Box
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

        navigate(`${url}?${searchParams.toString()}`, { replace: true });
      }}
    >
      <VStack
        align="flex-start"
        width="100%"
        color="black"
        flex="1"
        overflow="auto"
      >
        <HStack spacing={1}>
          <Avatar name={ancestors.name} src={ancestors.img} size="sm" />
        </HStack>
        <HStack spacing={1}>
          <Avatar
            name={"나"}
            src={
              "https://image.idus.com/image/files/da17e0c53a4e480284c5d49932722e5a.jpg"
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
                width={`${(descendant.count / maxCount) * 100}%`}
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
