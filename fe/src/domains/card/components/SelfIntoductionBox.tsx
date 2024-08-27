import { Box } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//자기소개페이지로 이동하는 버튼
const SelfIntroductionBox: React.FC = () => {
  const navigate = useNavigate();
  const { nickname } = useParams<{ nickname: string }>();
  const { t } = useTranslation();
  const handleClick = () => {
    navigate(`/${nickname}/info`);
  };

  return (
    <Box
      width="100%"
      mx="auto"
      p={4}
      bg="white"
      border="1px solid"
      _hover={{ bg: "gray.200" }}
      shadow="md"
      borderRadius="3xl"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flex={1}
      cursor="pointer"
      onClick={handleClick}
    >
      {t("main.CardComponent.self-introduction")}
    </Box>
  );
};

export default SelfIntroductionBox;
