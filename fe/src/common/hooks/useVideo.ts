import {useState} from "react";
import {deleteVideo, uploadVideo, VideoType} from "../api/videoAPI";

export interface UseVideoReturn {
    handleUpload : (type:string) => void;
    handleDeleteVideo : () => void,
    video : VideoType|null,
    loading : boolean
}

const useVideo = (initVideos?:VideoType) : UseVideoReturn => {
    // const [videos, setVideos] = useState<VideoType[]>(initVideos!=null ? initVideos : []);
    const [video, setVideo] = useState<VideoType|null>(initVideos!=null ? initVideos : null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleUpload = async (type:string) => {
        try {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "video/*";
            input.onchange = async (event: any) => {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();

                    formData.append("video", file);
                    setLoading(true);
                    const v = await uploadVideo(type, formData);
                    setLoading(false);
                    setVideo(v);
                }
            };

            input.click();
        } catch (error) {
            console.error("Image upload failed:", error);
        }
    };

    const handleDeleteVideo = async () => {
        setLoading(true);
        if(video){
            await deleteVideo(video.id)
            setVideo(null);
        }
        setLoading(false);
    }

    return {
        handleUpload,
        handleDeleteVideo,
        loading,
        video
    }
};

export default useVideo;