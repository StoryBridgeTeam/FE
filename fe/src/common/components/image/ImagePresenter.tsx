import React, {useState} from "react";
import exp from "constants";
import {
    Box,
    Flex,
    IconButton,
    Image,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Stack
} from "@chakra-ui/react";
import Slider from "react-slick";
import {carouselSettings, SampleNextArrow, SamplePrevArrow} from "../../../domains/amt/utils/carouselSetting";
import {X} from "tabler-icons-react";
import {AddIcon} from "@chakra-ui/icons";
import {ImageRes} from "../../hooks/useImage";

interface ImagePresenterProps{
    images:ImageRes[] | [],
    arrowSize?:number
}

interface ModalInfo{
    isModalOpen : boolean,
    selectedImg : ImageRes | null
}

const ImagePresenter:React.FC<ImagePresenterProps> = (props) => {
    const {images, arrowSize=16} = props;

    const [detailInfo, setDetailInfo] = useState<ModalInfo>({
        isModalOpen : false,
        selectedImg : null
    });

    const handleImageClick = (imgSrc : ImageRes) => {
        setDetailInfo({
            isModalOpen : true,
            selectedImg : imgSrc
        })
    }

    const handleCloseModal = () => {
        setDetailInfo({
            isModalOpen : false,
            selectedImg : null
        })
    }

    return <Box w={"100%"}>
        {images.length > 0 && (
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={10}  mb={5} padding={3}>
                <Box w={"100%"}>
                    <Slider
                        {...carouselSettings}
                        nextArrow={<SampleNextArrow size={arrowSize}/>}
                        prevArrow={<SamplePrevArrow size={arrowSize} />}
                    >
                        {images.map((imgSrc, index) => (
                            <Box key={index} position="relative">
                                <Flex
                                    h="15vh"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Image
                                        src={`http://image.storyb.kr/${imgSrc.path}`}
                                        alt={imgSrc.name}
                                        display="block"
                                        // maxH="30vh"
                                        maxH={"15vh"}
                                        maxW="100%"
                                        objectFit="contain"
                                        borderRadius="10px"
                                        onClick={() => handleImageClick(imgSrc)}
                                    />
                                </Flex>
                            </Box>
                        ))}
                    </Slider>
                </Box>
            </Stack>
        )}
        <Modal isOpen={detailInfo.isModalOpen} onClose={handleCloseModal} size={"xl"} isCentered>
            <ModalOverlay />
            <ModalBody>
                <ModalContent >
                    <Box>
                        <ModalCloseButton />
                        {detailInfo.selectedImg && (
                            <Image
                                src={`http://image.storyb.kr/${detailInfo.selectedImg.path}`}
                                alt={detailInfo.selectedImg.name}
                                objectFit="contain"
                            />
                        )}
                    </Box>
                </ModalContent>
            </ModalBody>
        </Modal>
    </Box>
}

export default ImagePresenter;