import React from "react";
import { GridItem, VStack, Heading } from "@chakra-ui/react";

interface SectionHeaderProps {
  title: string;
  isMobile: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isMobile,
}) => (
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

export interface SectionData {
  area: string;
  title: string;
  Component: React.ComponentType;
}

interface SectionProps extends SectionData {
  isMobile: boolean;
}

export const Section: React.FC<SectionProps> = ({
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
