import React, {Ref} from "react";
import { Box, Text } from "@chakra-ui/react";

interface POIItemProps {
  id: number;
  title: string;
  isMobile: boolean;
  onClick: (id: number) => void;
}

const POIItem: React.FC<POIItemProps> = ({ id, title, isMobile, onClick }) => (
  <Box
    m={4}
    bg="white"
    color="black"
    h="7%"
    shadow="md"
    borderRadius="3xl"
    onClick={() => onClick(id)}
    _hover={{ cursor: "pointer", bg: "gray.300" }}
    display="flex"
    alignItems="center"
    justifyContent="center"
    border="1px solid #CDCDCD"
    fontSize="sm"
    overflow="hidden"
    p={isMobile ? 4 : 0}
  >
    <Text isTruncated maxWidth="90%" fontSize={15}>
      {title}
    </Text>
  </Box>
);

export default POIItem;
