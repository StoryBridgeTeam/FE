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
    ) => Promise<ImageRes>;
}

export const useImage = () : useImageResponse => {
    const [images, setImages] = useState<ImageRes[]>([]);

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
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);

                    const uploadedImage = await uploadImage(uploadType, formData);
                    setImages((prevImages) => [...prevImages, uploadedImage]);
                }
            };

            input.click();
        } catch (error) {
            console.error("Image upload failed:", error);
        }

        return images;
    };

    const handleDeleteImage = async (imageId: number) => {
        setImages((prevImages) =>
            prevImages.filter((image) => image.id !== imageId)
        );
        return await deleteImage(imageId);
    };

    return {
        images,
        clearImage,
        handleUploadImage,
        handleDeleteImage
    };
}
