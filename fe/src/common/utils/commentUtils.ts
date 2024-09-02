export const getHighlightedText = (content:string, startIndex?: number, endIndex?: number) => {
    if (startIndex !== undefined && endIndex !== undefined) {
        return content.substring(startIndex, endIndex);
    }
    return "";
};
