import { Box, Button, ButtonProps } from "@chakra-ui/react";

interface SocialLoginButtonProps extends ButtonProps {
  icon: React.ElementType;
  text: string;
}

const SocialLoginButton = ({
  icon,
  text,
  ...props
}: SocialLoginButtonProps) => (
  <Button position="relative" {...props}>
    <Box
      as={icon}
      position="absolute"
      left="20px"
      top="50%"
      transform="translateY(-50%)"
    />
    {text}
  </Button>
);

export default SocialLoginButton;
