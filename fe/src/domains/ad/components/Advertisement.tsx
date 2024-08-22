import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface AdProps {
  ad: {
    id: number;
    content: string;
  };
}

const Advertisement: React.FC<AdProps> = ({ ad }) => {
  //   useEffect(() => {
  //   fetchAds();
  //   // if (nickName) {
  //   //   fetchPOIs(nickName); //초대토큰이 들어갈 수 있다
  //   // }
  // }, [fetchAds]);

  return (
    <Box bg="#E9E9E9" borderRadius="md" p={4} width="100%">
      <Text color="gray.500" textAlign="center">
        {ad.content}
      </Text>
    </Box>
  );
};

export default Advertisement;
