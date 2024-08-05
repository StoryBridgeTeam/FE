import React from "react";
import {
  Box,
  Grid,
  useBreakpointValue,
  GridItem,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import POIList from "./POIList";
import NetworkStatus from "./NetwortStatus";
import Advertisement from "./Advertisement";
import BusinessCard from "./BusinessCard";

interface SectionHeaderProps {
  title: string;
  isMobile: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, isMobile }) => (
  <Heading
    size={isMobile ? "xs" : "sm"}
    w="100%"
    textAlign="center"
    bg="white"
    p={isMobile ? 2 : 0}
    borderTop={isMobile ? "1px solid #CDCDCD" : ""}
    borderBottom={isMobile ? "1px solid #CDCDCD" : ""}
  >
    {title}
  </Heading>
);

interface SectionProps {
  area: string;
  title: string;
  Component: React.ComponentType;
  isMobile: boolean;
}

const Section: React.FC<SectionProps> = ({
  area,
  title,
  Component,
  isMobile,
}) => (
  <GridItem area={area}>
    <VStack h="100%" bg={isMobile ? "#F6F6F6" : "white"}>
      <SectionHeader title={title} isMobile={isMobile} />
      <Component />
    </VStack>
  </GridItem>
);

interface SectionData {
  area: string;
  title: string;
  Component: React.ComponentType;
}

const MainContent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();

  const gridTemplateAreas = isMobile
    ? `"card" "poi" "network" "ad"`
    : `"poi card ad" "poi network ad"`;

  const gridTemplateRows = isMobile ? "400px 400px 300px 400px" : "2fr 1fr";
  const gridTemplateColumns = isMobile ? "1fr" : "2fr 3fr 2fr";

  const sections: SectionData[] = [
    { area: "poi", title: "POI List", Component: POIList },
    { area: "card", title: "명함카드", Component: BusinessCard },
    { area: "network", title: "네트워크 현황", Component: NetworkStatus },
    { area: "ad", title: "광고", Component: Advertisement },
  ];

  return (
    <Box
      w="100%"
      h={isMobile ? "auto" : "90vh"}
      overflow={isMobile ? "auto" : "hidden"}
    >
      <Grid
        templateAreas={gridTemplateAreas}
        templateRows={gridTemplateRows}
        templateColumns={gridTemplateColumns}
        gap={isMobile ? 4 : 8}
        pt={isMobile ? 0 : 2}
        px={isMobile ? 0 : 28}
        pb={isMobile ? 4 : 8}
        h={isMobile ? "auto" : "100%"}
        bg={isMobile ? "#F6F6F6" : "white"}
      >
        {sections.map((section) => (
          <Section
            key={section.area}
            {...section}
            isMobile={isMobile as boolean}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default MainContent;
