import React, { useEffect, useState, FC } from "react";
import {Box, Flex, IconButton, Image, Stack, UseImageReturn} from "@chakra-ui/react";
import Slider from "react-slick";
import {carouselSettings} from "../../domains/amt/utils/carouselSetting";
import {X} from "tabler-icons-react";
import {AddIcon} from "@chakra-ui/icons";
import {ImageRes, useImageResponse} from "../hooks/useImage";

interface ImageUploaderProps{
    imageHook : useImageResponse
}

const ImageUploader: React.FC<ImageUploaderProps> = ({imageHook}) => {
    const {images, handleUploadImage, handleDeleteImage} = imageHook;

    return <Box w={"100%"}>
        {images.length > 0 && (
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} gap={10}  mb={5} padding={3}>
                <Box w={"90%"}>
                    <Slider {...carouselSettings}>
                        {images.map((imgSrc, index) => (
                            <Box key={index} position="relative">
                                <IconButton
                                    aria-label="Delete image"
                                    icon={<X size={18} />}
                                    position="absolute"
                                    colorScheme="red"
                                    top="5px"
                                    right="5px"
                                    size="xs"
                                    zIndex={1}
                                    onClick={() => handleDeleteImage(imgSrc.id)}
                                />
                                <Flex
                                    h="30vh"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Image
                                        src={`http://image.storyb.kr/${imgSrc.path}`}
                                        alt={imgSrc.name}
                                        display="block"
                                        maxH="30vh"
                                        maxW="100%"
                                        objectFit="contain"
                                        borderRadius="10px"
                                        // onClick={() => handleImageClick(imgSrc)}
                                    />
                                </Flex>
                            </Box>
                        ))}
                    </Slider>
                </Box>
                <Box>
                    <IconButton
                        aria-label={"Add image"}
                        icon={<AddIcon boxSize={2}/>}
                        size={"sm"}
                        onClick={() => handleUploadImage("COMMENT")}
                    />
                </Box>
            </Stack>
        )}
    </Box>
}

export default ImageUploader;