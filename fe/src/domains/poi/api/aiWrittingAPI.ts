import {llmAxiosInstance} from "../../../common/api/axiosInstance";

export const baseAiWrittingAPI = async (content:string) => {
    const response = await llmAxiosInstance.post("/openai/advice", {
        "model" : "gpt-4o-mini",
        "prompt" : content
    });

    return response.data.choices[0].message.content;
}

export const sentAiWrittingAPI = async (sents:string[]) => {
    const response = await llmAxiosInstance.post("/openai/compose",{
        sentences: sents,
        model : "gpt-4o-mini"
    })

    return response.data.choices[0].message.content;
}

export const newsAiWrittingAPI = async (url:string) => {
    const response = await llmAxiosInstance.post("/groq/news", {
        newsLink:url,
        modelType : "llama-3.1-70b-versatile"
    });

    return response.data.choices[0].message.content;
}

export const imageAiWrittingAPI = async (imgUrl : string) => {
    const response = await llmAxiosInstance.post(`/azure/caption?imageUrl=http://image.storyb.kr/${imgUrl}&lang=kr`)


    return response.data.choices[0].message.content;
}
