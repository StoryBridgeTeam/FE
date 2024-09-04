import React, {useEffect, useState} from "react";
import {Box, Button, Divider, Flex, HStack, IconButton, Input, Spinner, Text, Textarea, VStack} from "@chakra-ui/react";
import InfoPageLayout from "../InfoPageLayout";
import {AddIcon, CheckIcon, EditIcon} from "@chakra-ui/icons";
import {ImageRes, useImage} from "../../../common/hooks/useImage";
import ImageUploader from "../../../common/components/image/ImageUploader";
import {useAuthStore} from "../../../common/stores/AuthStore";
import {postCoverLetters, putCoverLetters} from "../api/InfoAPI";
import {useToastMessage} from "../../../common/hooks/useToastMessage";
import {useLocation, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const MAX_TITLE_LENGTH = 50;

interface CoverLetter {
    id: number;
    title: string;
    content: string;
    images?: ImageRes[];
}

interface CoverLetterCreatePageProps{
    entry : CoverLetter
}

const CoverLetterCreatePage = () => {
    const {nickName} = useAuthStore();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const {entry} = location.state;

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showToast } = useToastMessage();

    const [loading, setLoading] = useState<boolean>(false);
    const imageHook = useImage(entry.images);

    useEffect(() => {
        if(entry){
            setTitle(entry.title);
            setContent(entry.content);
        }

    }, [entry]);

    const handleClickCreate = async () => {
        setLoading(true);
        await putCoverLetters(nickName, {id:entry.id, title:title, content:content}, imageHook.images.map(i => i.id));
        setLoading(false);
        showToast(
            t("info.successEditCoverLetter"),
        t("info.successEditCoverLetterMsg"),
            "success"
        )
        navigate(`/${nickName}/info/${entry.id}`,{replace:true})
    };

    return <InfoPageLayout nickname={nickName}>
        <VStack w={"100%"} alignItems={"center"} padding={4}>
            <Box maxW={"600px"} w={"100%"}>
                <Flex justifyContent={"right"}>
                    <IconButton aria-label={"add"} onClick={handleClickCreate}>
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
                                <ImageUploader imageHook={imageHook} imageType={"COVER"}/>
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