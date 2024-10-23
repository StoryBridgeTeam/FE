import React, {useEffect, useRef} from "react";
import {Box, HStack, Text} from "@chakra-ui/react";

interface AdProps {
  ad: {
    id: number;
      code : string,
      width : number,
      height : number
  };
}

const Advertisement: React.FC<AdProps> = ({ ad }) => {
    const scriptElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.setAttribute(
            "src",
            "https://t1.daumcdn.net/kas/static/ba.min.js"
        );
        script.setAttribute(
            "charset",
            "utf-8"
        );

        script.setAttribute("async", "true");
        scriptElement.current?.appendChild(script);
    }, []);


    return (
    <HStack  p={4} width="100%" ref={scriptElement} justifyContent={"center"} alignItems={"center"}>
      <ins className="kakao_ad_area" style={{display:"none"}}
           data-ad-unit = {ad.code}
           data-ad-width = {ad.width}
           data-ad-height = {ad.height} />
    </HStack>
  );
};

export default Advertisement;
