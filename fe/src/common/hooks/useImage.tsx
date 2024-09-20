import React, {useState} from "react";
import {deleteImage, uploadImage} from "../api/imageAPI";

export interface ImageRes {
    id: number;
    name: string;
    contentType: string;
    size: number;
    path: string;
}

export interface useImageResponse{
    images:ImageRes[],
    clearImage:()=>void,
    handleUploadImage:(
        uploadType: string
    ) => Promise<ImageRes[]>;
    handleDeleteImage:(
        imageId: number
    ) => void
    loading:boolean
}

export const useImage = (initImages?:ImageRes[]) : useImageResponse => {
    const [images, setImages] = useState<ImageRes[]>(initImages!=null ? initImages : []);
    const [loading, setLoading] = useState<boolean>(false);

    const clearImage = () => {
        setImages([])
    };

    const handleUploadImage = async (uploadType : string) => {
        try {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async (event: any) => {
                const file = event.target.files[0];

                setLoading(true);
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    const uploadedImage = await uploadImage(uploadType, formData);
                    setImages((prevImages) => [...prevImages, uploadedImage]);
                }

                setLoading(false);
            };

            input.click();
        } catch (error) {
            console.error("Image upload failed:", error);
        }


        return images;
    };

    const handleDeleteImage = async (imageId: number) => {
        setLoading(true);
        setImages((prevImages) =>
            prevImages.filter((image) => image.id !== imageId)
        );

        await deleteImage(imageId);

        setLoading(false);
    };

    return {
        images,
        clearImage,
        handleUploadImage,
        handleDeleteImage,
        loading
    };
}
