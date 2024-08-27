import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  VStack,
  Spinner,
  Text,
  useBreakpointValue,
  Center,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { POI, usePOI } from "../../poi/hooks/usePOI";
import { css } from "@emotion/react";
import AddButton from "./AddButton";
import POIItem from "./POIItem";
import { FaAngleDown } from "react-icons/fa";

const scrollbarStyle = css`
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const POIList: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { nickName } = useParams<{ nickName: string }>();
  const savedNickName = localStorage.getItem("nickName");
  const [pois, setPois] = useState<POI[]>([]);
  const [page, setPage] = useState(0);
  const ishost = nickName === savedNickName;
  const { loading, error, fetchTitles, isLastPage } = usePOI();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const calculateSize = () => {
    const width = window.innerWidth;
    if (width < 768) return 4;
    else return 9;
  };
  const [size, setSize] = useState(calculateSize());

  useEffect(() => {
    const handleResize = () => {
      setSize(calculateSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (nickName) {
      loadTitles();
    }
  }, [nickName, size]);

  const loadTitles = async () => {
    try {
      console.log("loadTitles", page, size);
      let data: POI[];
      if (token) {
        data = await fetchTitles(nickName!, page, size, token);
      } else data = await fetchTitles(nickName!, page, size);

      setPois((prevPois) => [...prevPois, ...data]);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error("Failed to fetch titles", err);
    }
  };

  const handleCreatePOI = useCallback(() => {
    if (nickName) {
      navigate(`/${nickName}/poi/create`);
    }
  }, [nickName, navigate]);

  const handleGetPOI = useCallback(
    (poiId: number) => {
      if (nickName) {
        if (token) navigate(`/${nickName}/poi/${poiId}?token=${token}`);
        else navigate(`/${nickName}/poi/${poiId}`);
      }
    },
    [nickName, navigate]
  );

  if (loading && page === 0) {
    return <Spinner />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <VStack
      spacing={ishost ? 1 : 3}
      align="stretch"
      bg="#F6F6F6"
      borderRadius="3xl"
      h="100%"
      w="100%"
      overflow="hidden"
      p={2}
      color="#CDCDCD"
      border={isMobile ? "" : "1px solid"}
    >
      {ishost && (
        <AddButton isMobile={isMobile as boolean} onClick={handleCreatePOI} />
      )}
      <Box h="100%" overflowY="auto" css={scrollbarStyle}>
        {pois.length === 0 ? (
          <Center h="80%">
            <Text color={"gray.500"}>{t("POI 목록이 비어 있습니다.")}</Text>
          </Center>
        ) : (
          <>
            {pois.map((item) => (
              <POIItem
                key={item.id?.toString()}
                id={item.id as number}
                title={item.title}
                isMobile={isMobile as boolean}
                onClick={handleGetPOI}
              />
            ))}
            {!isLastPage && (
              <Center>
                <Button
                  onClick={loadTitles}
                  isLoading={loading}
                  size="md"
                  bg="#F6F6F6"
                >
                  <FaAngleDown fontSize="24px" />
                </Button>
              </Center>
            )}
          </>
        )}
      </Box>
    </VStack>
  );
};

export default POIList;
