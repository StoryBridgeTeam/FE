import {Box, Heading, HStack, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import React, {ReactNode} from "react";

export const PolicyHeader = ({title, date}:{title:string, date:string}) => {
    return <Box w={"100%"}>
        <Heading w={"100%"}>{title}</Heading>
        <Heading w={"100%"} size={"sm"} textAlign={"right"}>시행일자 : {date}</Heading>
        <Box w={"100%"} borderBottom={"2px solid gray"}/>
    </Box>
}

export const PolicyContent = ({title, content}:{title:string, content:string}) => {
    return <VStack w={"100%"}>
        <Heading w={"100%"} size={"lg"}>{title}</Heading>
        <Text w={"100%"} fontSize={"18px"} whiteSpace={"pre-line"}>{content}</Text>
    </VStack>
}

export const PolicyTabs = ({children}:{children:ReactNode}) => {
    return <HStack  w={"100%"} justifyContent={"space-between"} gap={0}>
        {children}
    </HStack>
}

export const PolicyTab = ({name, isLast=false, isCurrent=false, path}:{name:string, isLast?:boolean, isCurrent?:boolean, path:string}) => {
    const navigate = useNavigate();
    return <Heading size={"md"} py={5}  w={"100%"} textAlign={"center"}
                    color={isCurrent ? "gray.800" : "#dbdbdb"}
                    borderY={"1px solid"} borderX={"1px solid"}
                    borderColor={isCurrent ? "gray.800" : "#dbdbdb"}
                    onClick={() => navigate(path)}
                    cursor={"pointer"}
    >
        {name}
    </Heading>
}
