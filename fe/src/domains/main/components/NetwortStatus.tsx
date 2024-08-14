import {
  Avatar,
  Box,
  useBreakpointValue,
  VStack,
  Text,
  HStack,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getNicknameToken } from "../../../common/utils/nickname";

const NetworkStatus: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const ancestors = [
    { name: "Ancestor 1", img: "/path/to/image1.jpg" },
    { name: "Ancestor 2", img: "/path/to/image2.jpg" },
    { name: "Ancestor 3", img: "/path/to/image3.jpg" },
    { name: "Ancestor 4", img: "/path/to/image4.jpg" },
    { name: "Ancestor 5", img: "/path/to/image5.jpg" },
    { name: "Ancestor 6", img: "/path/to/image1.jpg" },
    { name: "Ancestor 7", img: "/path/to/image2.jpg" },
    { name: "Ancestor 8", img: "/path/to/image3.jpg" },
    { name: "Ancestor 9", img: "/path/to/image4.jpg" },
  ];

  const descendants = [{ count: 17 }, { count: 31 }, { count: 76 }];

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
        navigate(`/${getNicknameToken()}/amt`);
      }}
    >
      <VStack
        align="flex-start"
        width="100%"
        color="black"
        flex="1"
        overflow="auto"
      >
        <Grid templateColumns="repeat(10, 1fr)">
          {ancestors.map((ancestor, index) => (
            <GridItem key={index} mr={2}>
              <HStack spacing={1}>
                <Avatar name={ancestor.name} src={ancestor.img} size="sm" />
              </HStack>
            </GridItem>
          ))}
        </Grid>
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
