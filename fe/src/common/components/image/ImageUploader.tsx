import React, { useEffect, useState, FC } from "react";
import {Box, Button, Flex, IconButton, Image, Spinner, Stack, UseImageReturn} from "@chakra-ui/react";
import Slider from "react-slick";
import {carouselSettings} from "../../../domains/amt/utils/carouselSetting";
import {X} from "tabler-icons-react";
import {AddIcon} from "@chakra-ui/icons";
import {ImageRes, useImageResponse} from "../../hooks/useImage";

interface ImageUploaderProps{
    imageHook : useImageResponse,
    imageType : string
    isUploadable ?: boolean
}

const ImageUploader: React.FC<ImageUploaderProps> = ({imageHook, imageType, isUploadable=true}) => {
    const {images, handleUploadImage, handleDeleteImage} = imageHook;

    return <Box w={"100%"}>
        { images.length > 0 && (
                        <Stack direction={"column"} alignItems={"center"} justifyContent={"center"} gap={10} mb={5} padding={3}>
                            <Box w={"90%"}>
                                <Slider {...carouselSettings}>
                                    {images.map((imgSrc, index) => (
                                        <Box key={index} position={"relative"}>
                                            <Flex
                                                h="30vh"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <IconButton
                                                    aria-label="Delete image"
                                                    icon={<X size={18} />}
                                                    position="absolute"
                                                    colorScheme="red"
                                                    top={0}
                                                    right={0}
                                                    size="xs"
                                                    zIndex={1}
                                                    onClick={() => handleDeleteImage(imgSrc.id)}
                                                />
                                                <Image
                                                    src={`http://image.storyb.kr/${imgSrc.path}`}
                                                    alt={imgSrc.name}
                                                    display="block"
                                                    h="30vh"
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
                            {
                                isUploadable &&
                                <Box>
                                    <Button
                                        aria-label={"Add image"}
                                        leftIcon={<AddIcon boxSize={2}/>}
                                        variant={"outline"}
                                        size={"sm"}
                                        onClick={() => handleUploadImage(imageType)}
                                    >
                                        이미지 추가
                                    </Button>

                                </Box>
                            }
                        </Stack>
                    )
        }
    </Box>
}

export default ImageUploader;