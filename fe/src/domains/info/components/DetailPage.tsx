import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  useBreakpointValue,
  Button,
  Input,
} from "@chakra-ui/react";
import { Edit, Check } from "tabler-icons-react";
import { useTranslation } from "react-i18next";
import { useTextSelection } from "../hook/useTextSelection";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { useCommentStore } from "../Store/CommentStore";
import { renderContentWithIcons } from "./renderContentWithIcons";
import { useProfileStore } from "../Store/useProfileStore";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getNicknameToken } from "../../../common/utils/nickname";
import { useParams } from "react-router-dom";

interface DetailPageProps {
  id: number;
  data: { title: string; content: string };
  onSave: (id: number, updatedData: { title: string; content: string }) => void;
  onBack: () => void;
}

const DetailPage: React.FC<DetailPageProps> = ({
  id,
  data = { title: "", content: "" },
  onSave,
  onBack,
}) => {
  const { nickName } = useParams<{ nickName: string }>();

  const { handleMouseUp } = useTextSelection();
  const { comments } = useCommentStore();
  const { t } = useTranslation();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [editedTitle, setEditedTitle] = useState<string>(data.title);
  const [editedContent, setEditedContent] = useState<string>(data.content);
  const { isEdit, setEdit } = useProfileStore();
  const name = getNicknameToken();
  const ishost = nickName === name;

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSaveClick = () => {
    onSave(id, { title: editedTitle, content: editedContent });
    setEdit(false);
  };

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditedContent(data);
  };

  const scrollToHighlightedText = (startIndex?: number, endIndex?: number) => {
    if (startIndex === undefined || endIndex === undefined) return;

    const highlightElements = document.querySelectorAll(`[id^='highlight-']`);
    highlightElements.forEach((element) => {
      const id = element.id.replace("highlight-", "");
      const comment = comments.find((c) => c.id.toString() === id);
      if (
        comment?.tagInfo?.startIndex === startIndex &&
        comment?.tagInfo?.lastIndex === endIndex
      ) {
        (element as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  const scrollToHighlightedComment = (
    startIndex?: number,
    endIndex?: number
  ) => {
    if (startIndex === undefined || endIndex === undefined) return;

    const comment = comments.find(
      (c) =>
        c.tagInfo?.startIndex === startIndex &&
        c.tagInfo?.lastIndex === endIndex
    );
    if (comment) {
      const elementId = `comment-${comment.id}`;
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        console.warn(`Element with id '${elementId}' not found.`);
      }
    } else {
      console.warn("Comment not found with specified indexes.");
    }
  };

  const processedComments = comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    startIndex: comment.tagInfo?.startIndex || 0,
    endIndex: comment.tagInfo?.lastIndex || 0,
  }));

  return (
    <Box
      mt={6}
      w="full"
      cursor="pointer"
      position="relative"
      onMouseUp={handleMouseUp}
      dir="col"
    >
      <Flex w="full" justifyContent="space-between" alignItems="center" mb={5}>
        <Button onClick={onBack}>{t("info.list")}</Button>
        {isEdit ? (
          <Button onClick={handleSaveClick}>
            <Check size={24} color="black" />
          </Button>
        ) : (
          <Button onClick={handleEditClick}>
            <Edit size={24} color="black" />
          </Button>
        )}
      </Flex>
      <Flex
        h={isMobile ? undefined : "calc(100vh - 165px)"}
        overflowY="auto"
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
        direction="column"
      >
        <Flex alignItems="center" dir="row">
          {isEdit ? (
            <Input
              value={editedTitle}
              onChange={(e) => {
                if (e.target.value.length <= 20) {
                  setEditedTitle(e.target.value);
                }
              }}
              fontSize="lg"
              fontWeight="bold"
            />
          ) : (
            <Text fontWeight="bold" fontSize="lg">
              {data.title || editedTitle}
            </Text>
          )}
          <Box flex="1" borderBottom="2px" ml={2} />
        </Flex>
        <Box bg="#EEEEEE" mt={4} p={5} borderTopRadius="30" userSelect="text">
          {isEdit ? (
            <CKEditor
              editor={ClassicEditor}
              data={editedContent}
              onChange={handleEditorChange}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: data.content || editedContent,
              }}
            />
          )}
        </Box>
        <Box flex="1">
          <CommentList
            id={id}
            content={data.content}
            highlightComment={scrollToHighlightedText}
          />
        </Box>
      </Flex>
      {!isEdit && <CommentInput id={id} />}
    </Box>
  );
};

export default DetailPage;
