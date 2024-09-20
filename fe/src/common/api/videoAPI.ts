import axiosInstance, {videoServerAxiosInstance} from "./axiosInstance";
import {type} from "os";

export interface VideoType{
    id:number,
    path:string,
    name:string,
    uploadStatus:string,
    uploadedAt:string,
    playTime:string
}

export const uploadVideo = async (uploadType:string, formData:FormData) => {
    try {
        const response = await videoServerAxiosInstance.post(
            `/videos?type=${uploadType}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data.data;
    } catch (error) {
        console.error("Failed to fetch comments:", error);
        throw error;
    }
}

export const deleteVideo = async (videoId : number) => {
    const response = await videoServerAxiosInstance.delete(
        `/videos/${videoId}`,
    );
}