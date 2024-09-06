import {Box, Button, ButtonProps, Heading, Link} from "@chakra-ui/react";
import React from "react";

interface SocialLoginButtonProps extends ButtonProps {
  icon: React.ElementType;
  text: string;
  href:string
}

const SocialLoginButton = ({
  icon,
  text,
    href,
  ...props
}: SocialLoginButtonProps) => (
    <Link w={"100%"} _hover={{}} href={href}>
        <Box w={"100%"} padding={2.5} _hover={{cursor:"pointer"}} textAlign={"center"} position="relative" {...props} borderRadius={8}>
            <Box
                as={icon}
                position="absolute"
                left="20px"
                top="50%"
                transform="translateY(-50%)"
            />
            <Heading size={"sm"}>
                {text}
            </Heading>
        </Box>
    </Link>
);

export default SocialLoginButton;
