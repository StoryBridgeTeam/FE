import {
  Flex,
  useBreakpointValue,
  Box,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

const NetWork = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      p={4}
      bg="white"
      shadow="md"
      borderRadius="3xl"
      mt={"40px"}
      width="400px"
      h="200px"
      border={"1px solid black"}
      alignContent={"center"}
    >
      <CircularProgress value={40} size={"150px"}>
        <CircularProgressLabel fontSize={"20px"}>
          총 점수
          <br />
          40
        </CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
};

export default NetWork;
