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
    bg="white"
    color="black"
    borderRadius="5"
    onClick={() => onClick(id)}
    _hover={{ cursor: "pointer", bg: "gray.200" }}
    display="flex"
    alignItems="center"
    border="1px solid #CDCDCD"
    overflow="hidden"
    px={5}
    py={3}
  >
    <Text isTruncated textAlign={"left"} fontSize={12}>
      {title}
    </Text>
  </Box>
);

export default POIItem;
