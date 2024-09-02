import React, { useEffect, useMemo } from "react";
import { Box, Grid, useBreakpointValue } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import POIList from "../../poi/components/POIList";
import NetworkStatus from "./NetworkStatus";
import Advertisement from "../../ad/components/Advertisement";
import CardComponent from "../../card/components/CardComponent";
import AdComponent from "../../ad/components/AdComponent";
import { Section, SectionData } from "./Section";
import { useAdStore } from "../../ad/stores/AdStore";

interface Ad {
  id: number;
  content: string;
}

const MainContent: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { t } = useTranslation();
  const { ads } = useAdStore();
  const sections: SectionData[] = [
    {
      area: "card",
      title: t("main.MainContent.businessCard"),
      Component: CardComponent,
    },
    {
      area: "poi",
      title: "POI List",
      Component: POIList,
    },
    {
      area: "network",
      title: t("main.MainContent.networkStatus"),
      Component: NetworkStatus,
    },
  ];

  const mobileLayout = useMemo(() => {
    const result: SectionData[] = [];
    const adGroups: Ad[][] = [[], [], []];

    ads.forEach((ad, index) => {
      adGroups[index % 3].push(ad);
    });

    sections.forEach((section, index) => {
      result.push(section);
      if (adGroups[index].length > 0) {
        result.push({
          area: `ad${index + 1}`,
          title: "",
          Component: () => (
            <>
              {adGroups[index].map((ad) => (
                <Advertisement key={ad.id} ad={ad} />
              ))}
            </>
          ),
        });
      }
    });

    return result;
  }, [sections, ads]);

  const gridTemplateAreas = useMemo(() => {
    if (!isMobile) return `"poi card ad" "poi network ad"`;
    return mobileLayout.map((section) => `"${section.area}"`).join(" ");
  }, [isMobile, mobileLayout]);

  const gridTemplateRows = useMemo(() => {
    if (!isMobile) return "2fr 1fr";
    return mobileLayout
      .map((section) => (section.area.startsWith("ad") ? "auto" : "400px"))
      .join(" ");
  }, [isMobile, mobileLayout]);

  const gridTemplateColumns = isMobile ? "1fr" : "2fr 3fr 2fr";

  return (
    <Box
      w="100%"
      h={isMobile ? "auto" : "90vh"}
      overflow={isMobile ? "auto" : "hidden"}
    >
      <Grid
          maxW={"1400px"}
        templateAreas={gridTemplateAreas}
        templateRows={gridTemplateRows}
        templateColumns={gridTemplateColumns}
        gap={isMobile ? 4 : 8}
        pt={isMobile ? 0 : 2}
        px={isMobile ? 0 : 12}
        pb={isMobile ? 4 : 8}
        h={isMobile ? "auto" : "100%"}
        bg={isMobile ? "#F6F6F6" : "white"}
          m={"0 auto"}
      >
        {isMobile ? (
          mobileLayout.map((section) => (
            <Section key={section.area} {...section} isMobile={true}/>
          ))
        ) : (
          <>
            {sections.map((section) => (
              <Section key={section.area} {...section} isMobile={false} />
            ))}
            <Section
              key="ad"
              area="ad"
              title={t("main.MainContent.advertisement")}
              Component={AdComponent}
              isMobile={false}
            />
          </>
        )}
      </Grid>
    </Box>
  );
};

export default MainContent;
