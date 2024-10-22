import {
    Box, Divider,
    Drawer, DrawerBody, DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    IconButton,
    useBreakpointValue, useDisclosure
} from "@chakra-ui/react";
import React, {FC, useState} from "react";
import LoginAppBar from "../../common/components/LoginAppBar";
import { useToastMessage } from "../../common/hooks/useToastMessage";
import { useAuthStore } from "../../common/stores/AuthStore";
import DynamicForm from "./components/DynamicForm";
import {HamburgerIcon} from "@chakra-ui/icons";
import ProfileForm from "./components/ProfileForm";
import InvitationManage from "./components/InvitationManage";

export type ComponentMapping = {
    [key: string]: () => JSX.Element;
};

const menuItems: ComponentMapping = {
    "회원정보 수정": () => <ProfileForm/>,
    "초대장 관리": () => <InvitationManage/>,
    // "푸시알림 설정": () => <ProfileForm />,
};

const MyPage: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
    const [selectedItem, setSelectedItem] = useState<string>("회원정보 수정");
  const { showToast } = useToastMessage();
  const logout = useAuthStore((state) => state.logout);
    const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <Flex width={"100%"} minH="100vh" direction="column">
      <LoginAppBar />
        {
            isMobile &&
            <>
                <Box borderBottom={"1px solid #cdcdcd"} bgColor={"white"} width={"100%"} height={"50px"} mt={"50px"} zIndex={999} position={"fixed"}
                >
                    <IconButton aria-label={"side"} variant={"ghost"}  onClick={onOpen}>
                        <HamburgerIcon/>
                    </IconButton>
                </Box>
                <Drawer isOpen={isOpen} onClose={onClose} placement={"left"} >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerCloseButton />
                        </DrawerHeader>
                        <DrawerBody p={0} mt={3}>
                            {
                                Object.keys(menuItems).map(item => (
                                    <>
                                        <Box p={5} fontWeight={"bold"} fontSize={"18px"}
                                             bgColor={item === selectedItem ? "gray.200" : "white"}
                                             onClick={() => {
                                                 setSelectedItem(item)
                                                 onClose()
                                             }}
                                             cursor={"pointer"}
                                        >
                                            {item}
                                        </Box>
                                        <Divider />
                                    </>
                                ))
                            }
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </>
        }
      <Flex
        mt={isMobile ? "100px" : "60px"}
        height={isMobile ? "calc(100vh - 100px)" : "calc(100vh - 60px)"}
        width={"100%"}
        direction={isMobile ? "column" : "row"}
        justifyContent={"center"}
        px={isMobile? 0 :20}
      >
        <DynamicForm menuItems={menuItems} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
      </Flex>
    </Flex>
  );
};

export default MyPage;
