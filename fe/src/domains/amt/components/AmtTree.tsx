import {
  Box,
  VStack,
  HStack,
  Text,
  Grid,
  GridItem,
  Avatar,
} from "@chakra-ui/react";

const AmtTree = () => {
  const ancestors = [
    { name: "Ancestor 1", img: "/path/to/image1.jpg" },
    { name: "Ancestor 2", img: "/path/to/image2.jpg" },
    { name: "Ancestor 3", img: "/path/to/image3.jpg" },
    { name: "Ancestor 4", img: "/path/to/image4.jpg" },
    { name: "Ancestor 5", img: "/path/to/image5.jpg" },
  ];

  const descendants = [
    { count: 17 },
    { count: 31 },
    { count: 76 },
    { count: 100 },
    { count: 182 },
  ];

  const maxCount = Math.max(...descendants.map((d) => d.count));

  return (
    <VStack spacing={3} width="100%" align="center">
      <Box alignSelf="flex-start" marginRight="auto" ml={20} mt={10}>
        <Grid templateColumns="repeat(10, 1fr)" mb={2}>
          {ancestors.map((ancestor, index) => (
            <GridItem key={index}>
              <HStack spacing={1}>
                <Avatar name={ancestor.name} src={ancestor.img} size="md" />
              </HStack>
            </GridItem>
          ))}
        </Grid>

        <Text fontSize="md" fontWeight={"bold"} mb={2} ml={5}>
          ⋮
        </Text>

        <Grid templateColumns="repeat(10, 1fr)" mb={5}>
          {ancestors.map((ancestor, index) => (
            <GridItem key={index}>
              <HStack spacing={1}>
                <Avatar name={ancestor.name} src={ancestor.img} size="md" />
                {index === ancestors.length - 1 && (
                  <Text fontSize="md" fontWeight={"bold"} ml={3}>
                    ...
                  </Text>
                )}
              </HStack>
            </GridItem>
          ))}
        </Grid>

        <HStack spacing={1} mb={5}>
          <Avatar
            name={"나"}
            src={
              "https://image.idus.com/image/files/da17e0c53a4e480284c5d49932722e5a.jpg"
            }
            size="md"
          />
          <Text fontSize="md" fontWeight={"bold"} ml={3}>
            ...
          </Text>
        </HStack>

        <Grid templateColumns="repeat(10, 1fr)" mb={3}>
          {ancestors.map((ancestor, index) => (
            <GridItem key={index}>
              <HStack spacing={1}>
                <Avatar name={ancestor.name} src={ancestor.img} size="md" />
                {index === ancestors.length - 1 && (
                  <Text fontSize="md" fontWeight={"bold"} ml={3}>
                    ...
                  </Text>
                )}
              </HStack>
            </GridItem>
          ))}
        </Grid>
      </Box>

      <VStack spacing={6} align="stretch" width="90%">
        {descendants.map((descendant, index) => (
          <HStack key={index} spacing={4}>
            <Box
              bg="blackAlpha.800"
              height="30"
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
  );
};

export default AmtTree;
