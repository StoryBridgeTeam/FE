import React, {useRef, useState} from "react";
import {
    Box,
    Flex,
    Button,
    VStack,
    useBreakpointValue,
    calc,
    IconButton,
    Drawer,
    useDisclosure,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerBody, DrawerHeader, Divider,
} from "@chakra-ui/react";
import ProfileForm from "./ProfileForm";
import InvitationManage from "./InvitationManage";
import {HamburgerIcon} from "@chakra-ui/icons";
import {ComponentMapping} from "../MyPage";

const DynamicForm = ({menuItems, selectedItem, setSelectedItem}:{menuItems : ComponentMapping, selectedItem:string, setSelectedItem : any}) => {
    const isMobile = useBreakpointValue({base: true, md: false});

    return (
        <Flex
            // align={"center"}
            flexDirection={isMobile ? "column" : "row"}
            justifyContent={"center"}
            alignItems={"center"}
            width={isMobile ? "100%" : "1400px"}
            mt={"20px"}
            // height={"100%"}
        >
            {
                !isMobile &&
                <Flex direction={"column"}>
                    <Box
                        borderTopRadius={"30px"}
                        bg={"#000000"}
                        w={isMobile ? "full" : "200px"}
                        p="5"
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
                        borderRight={isMobile ? "none" : "1px"}
                        borderColor="gray.200"
                        h={"calc(100vh - 200px)"}
                        border={"1px solid #CDCDCD"}
                    >
                        <VStack align="stretch" gap={0}>
                            {Object.keys(menuItems).map((item) => (
                                <Button
                                    key={item}
                                    variant="ghost"
                                    w="full"
                                    onClick={() => setSelectedItem(item)}
                                    bgColor={item === selectedItem ? "gray.200" : "white"}
                                    padding={7}
                                >
                                    {item}
                                </Button>
                            ))}
                        </VStack>
                    </Box>
                </Flex>
            }
            <Box width={"100%"} px={10}
            >
                {menuItems[selectedItem]()}
            </Box>
        </Flex>
    );
};

export default DynamicForm;
