import React, { useEffect } from "react";
import { VStack, Box, Text, useBreakpointValue } from "@chakra-ui/react";
import { useAdStore } from "../stores/AdStore";
import Advertisement from "./Advertisement";

const AdComponent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { desktopAds} = useAdStore();

  return (
    <Box
      bg="#F6F6F6"
      borderRadius="3xl"
      w="100%"
      minWidth={"320px"}
      maxWidth={"330px"}
      height={"100%"}
      // p={6}
      // color="#CDCDCD"
      // border={isMobile ? "" : "1px solid"}
    >
      <VStack align="stretch" width="100%" gap={0}>
        {desktopAds.map((ad) => (
            <Advertisement ad={ad} />
        ))}
      </VStack>
    </Box>
  );
};

export default AdComponent;
