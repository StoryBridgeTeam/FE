import { Box } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//자기소개페이지로 이동하는 버튼
const SelfIntroductionBox: React.FC = () => {
  const navigate = useNavigate();
  const { nickName } = useParams<{ nickName: string }>();
  const { t } = useTranslation();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleClick = () => {
    const url = `/${nickName}/info`;
    const searchParams = new URLSearchParams();

    if (token) {
      searchParams.append("token", token);
    }

    navigate(`${url}?${searchParams.toString()}`);
  };

  return (
    <Box
      width="100%"
      mx="auto"
      p={4}
      bg="white"
      border="1px solid"
      _hover={{ bg: "gray.200" }}
      // shadow="md"
      // borderRadius="3xl"
        borderRadius="10px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      // flex={1}
      cursor="pointer"
      // maxHeight="50px"
        height={"250px"}
      onClick={handleClick}
    >
      {t("main.CardComponent.self-introduction")}
    </Box>
  );
};

export default SelfIntroductionBox;
