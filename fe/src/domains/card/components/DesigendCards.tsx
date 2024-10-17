import React, {useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import useCardHook, {UseCardHookReturn} from "../hooks/useCardHook";
import {HorizontalBarDesign, VerticalBarDesign} from "./CardDesigns";
import {Box, Heading, VStack} from "@chakra-ui/react";
import Slider from "react-slick";
import {carouselSettings, SampleNextArrow, SamplePrevArrow} from "../../amt/utils/carouselSetting";
import {set} from "date-fns";
import {type} from "os";

const DesignedCard = ({cardHook, detail=false, isHost = false}: { cardHook: UseCardHookReturn, detail?:boolean, isHost?: boolean }) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const navigate = useNavigate();

    const {currentCardInfo: cardInfo, isCreated} = cardHook;
    const [editMode, setEditMode] = useState<boolean>(false);
    const { nickName="" } = useParams<{ nickName: string }>();

    const renderDesignType = () => {
        switch (cardInfo?.designType){
            case "verticalBar" :
                return <VerticalBarDesign editMode={editMode} setEditMode={setEditMode} handleClick={handleClick} cardHook={cardHook} detail={detail} isHost={isHost} />
            case "horizontalBar" :
                return <HorizontalBarDesign editMode={editMode} setEditMode={setEditMode} handleClick={handleClick} cardHook={cardHook} detail={detail} isHost={isHost} />
            default:
                return <HorizontalBarDesign editMode={editMode} setEditMode={setEditMode} handleClick={handleClick} cardHook={cardHook} detail={detail} isHost={isHost} />
        }
    }

    const handleClick = () => {
        const url = `/${nickName}/card`;
        const searchParams = new URLSearchParams();

        if (token) {
            searchParams.append("token", token);
        }

        navigate(`${url}?${searchParams.toString()}`);
    };

    const handleSelectDesignType = (type: string) => {
        cardHook.handleDeisgnTypeChange(type);
    }

    return <VStack>
        {
            renderDesignType()
        }
        {
            isCreated && editMode &&
            <Box w={"100%"} mt={6} px={5}>
                <Heading mb={4} size={"md"} width={"100%"} textAlign={"left"}>명함 디자인 선택</Heading>
                <Slider
                    {...carouselSettings}
                >
                    <Box position="relative">
                        <VerticalBarDesign editMode={false} handleClick={() => handleSelectDesignType("verticalBar")} cardHook={cardHook} isHost={false} detail={detail}/>
                    </Box>
                    <Box position="relative">
                        <HorizontalBarDesign editMode={false} handleClick={() => handleSelectDesignType("horizontalBar")} cardHook={cardHook} isHost={false} detail={detail}/>
                    </Box>
                </Slider>
            </Box>
        }
    </VStack>
}


export default DesignedCard;