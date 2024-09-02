import React, {useState} from "react";
import {Box, Button, Divider, Flex, HStack, IconButton, Input, Spinner, Text, Textarea, VStack} from "@chakra-ui/react";
import InfoPageLayout from "../InfoPageLayout";
import {AddIcon, CheckIcon, EditIcon} from "@chakra-ui/icons";
import {useImage} from "../../../common/hooks/useImage";
import ImageUploader from "../../../common/components/image/ImageUploader";
import {useAuthStore} from "../../../common/stores/AuthStore";
import {postCoverLetters} from "../api/InfoAPI";

const MAX_TITLE_LENGTH = 50;

const CoverLetterCreatePage = () => {
    const {nickName} = useAuthStore();

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const imageHook = useImage();

    const handleClickCreate = async () => {
        setLoading(true);
        await postCoverLetters(nickName, {title:title, content:content, imageIds:imageHook.images.map(i => i.id)})
        setLoading(false);
    };

    return <InfoPageLayout nickname={nickName}>
        <VStack w={"100%"} alignItems={"center"} padding={4}>
            <Box maxW={"600px"} w={"100%"}>
                <Flex justifyContent={"right"}>
                    <IconButton aria-label={"add"}>
                        <EditIcon />
                    </IconButton>
                </Flex>
                <Input
                    padding={2}
                    placeholder="제목"
                    size="lg"
                    variant="unstyled"
                    fontSize="2xl"
                    fontWeight="bold"
                    _placeholder={{ color: "#828282" }}
                    textAlign="center"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={MAX_TITLE_LENGTH}
                    isDisabled={loading}
                />
                <Text fontSize="sm" color="gray.500" textAlign="right" mt={-5}>
                    {title.length}/{MAX_TITLE_LENGTH}
                </Text>
                <Divider borderColor="#828282" borderWidth="1px" />
                    <HStack justifyContent={"center"} paddingY={4}>
                        {
                            imageHook.loading ? <Spinner /> :
                            imageHook.images.length==0 ?
                                <Flex border={"1px dashed black"} borderRadius={5} w={"200px"} h={"150px"}
                                      justifyContent={"center"} alignItems={"center"}
                                >
                                    <Button leftIcon={<AddIcon fontSize={12} />} size={"sm"} fontSize={12} onClick={() => imageHook.handleUploadImage("COVER")}>
                                        이미지 추가
                                    </Button>
                                </Flex>
                                :
                                <ImageUploader imageHook={imageHook} />
                        }
                    </HStack>
                    <Textarea
                        padding={4}
                        minHeight="300px"
                        placeholder="본문 내용을 작성해주세요"
                        variant="unstyled"
                        px={6}
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        isDisabled={loading}
                    />
            </Box>
        </VStack>
    </InfoPageLayout>
}

export default CoverLetterCreatePage;