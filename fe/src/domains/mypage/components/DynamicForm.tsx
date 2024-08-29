import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import ProfileForm from "./ProfileForm";

type ComponentMapping = {
  [key: string]: () => JSX.Element;
};

const menuItems: ComponentMapping = {
  "회원정보 수정": () => <ProfileForm />,
  // "언어 설정": () => <ProfileForm />,
  // "푸시알림 설정": () => <ProfileForm />,
};

const DynamicForm: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>("회원정보 수정");
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      align={"center"}
      margin={"0 auto"}
      flexDirection={isMobile ? "column" : "row"}
    >
      {!isMobile && (
        <Flex direction={"column"}>
          <Box
            borderTopRadius={"30px"}
            bg={"#000000"}
            w={isMobile ? "full" : "200px"}
            p="5"
            mt={"5px"}
            textAlign={"center"}
            fontWeight={"bold"}
            color={"white"}
            height={"55px"}
          >
            마이페이지
          </Box>
          <Box
            borderBottomRadius={"30px"}
            w={isMobile ? "full" : "200px"}
            p="3"
            borderRight={isMobile ? "none" : "1px"}
            borderColor="gray.200"
            mb={"10px"}
            h={"530px"}
            border={"1px solid #CDCDCD"}
          >
            <VStack align="stretch">
              {Object.keys(menuItems).map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  w="full"
                  mb="1"
                  onClick={() => setSelectedItem(item)}
                >
                  {item}
                </Button>
              ))}
            </VStack>
          </Box>
        </Flex>
      )}

      <Box flex="1" p={isMobile ? undefined : "5"} mt={2}>
        {menuItems[selectedItem]()}
      </Box>
    </Flex>
  );
};

export default DynamicForm;
