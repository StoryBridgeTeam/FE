export const formatTimestamp = (timestamp: string) => {
    const utcDate = new Date(timestamp + "Z"); //UTC 시간을 올바르게 파싱하기 위해 'Z'를 추가
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    return utcDate.toLocaleString(undefined, options);
};
