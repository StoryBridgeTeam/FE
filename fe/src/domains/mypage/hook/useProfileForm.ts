import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import {
  getMyPageInfo,
  updateNickname,
  updatePassword,
  requestEmailVerification,
  uploadProfile,
} from "../api/MyPageAPI";
import { uploadImage } from "../../../common/api/imageAPI";
import {useAuthStore} from "../../../common/stores/AuthStore";
import {set} from "date-fns";
import {getIsCreatedCard} from "../../card/api/cardAPI";

const useProfileForm = () => {
  const toast = useToast();
  const [profile, setProfile] = useState({
    nickname: "",
    email: "",
    originPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    isCardCreated : false,
  });

  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const {setProfileImage} = useAuthStore()

  const fetchProfile = async () => {
    try {
      const data = await getMyPageInfo();
      setProfile({
        nickname: data.nickname || "",
        email: data.email || "",
        originPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        isCardCreated : data.isCardCreated
      });
      if (data.profileImage) {
        setImage(data.profileImage.path || "");
      }
    } catch (error) {
      toast({
        title: "Error fetching profile",
        description: "Failed to load profile data.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfile();
    setLoading(false);
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const checkCreatedProfile = () => {
    if(!profile.isCardCreated){
      toast({
        title : "명함 미생성",
        description : "명함을 생성하여야 프로필 이미지를 설정할 수 있습니다.",
        status : "error",
        duration : 3000,
        isClosable: true
      })

      return false;
    }

    return true;
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if(file && file.size>(1024*1024*3)){
      toast({
        title : "이미지 용량 초과",
        description : "이미지 용량은 최대 3MB까지 가능합니다.",
        status : "error",
        duration : 3000,
        isClosable: true
      })
      return;
    }

    setLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadType = "PROFILE";

      const uploadedImage = await uploadImage(uploadType, formData);
      await uploadProfile(uploadedImage.id);
      setProfileImage(uploadedImage);
      fetchProfile();
    }
    setLoading(false);
  };

  const validatePassword = () => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;

    if (profile.newPassword !== profile.confirmNewPassword) {
      toast({
        title: "Password mismatch",
        description: "New passwords do not match.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!passwordRegex.test(profile.newPassword)) {
      toast({
        title: "Invalid password",
        description:
          "Password must be 8-15 characters long and include letters, numbers, and special characters.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const requestVerification = async () => {
    try {
      const id = await requestEmailVerification(profile.email);
      return id;
    } catch (error) {
      toast({
        title: "Error requesting verification",
        description: "Failed to request email verification.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const saveNickname = async () => {
    try {
      await updateNickname(profile.nickname);
      toast({
        title: "Nickname updated",
        description: "Your nickname has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      localStorage.setItem("nickName", profile.nickname);
    } catch (error) {
      toast({
        title: "Error updating nickname",
        description: "Failed to update your nickname.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const savePassword = async () => {
    if (!validatePassword()) return;

    try {
      await updatePassword(profile.originPassword, profile.newPassword);
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setProfile({
        ...profile,
        originPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      toast({
        title: "Error updating password",
        description: "Failed to update your password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    profile,
    image,
    handleInputChange,
    handleImageChange,
    requestVerification,
    saveNickname,
    savePassword,
    loading,
    checkCreatedProfile
  };
};

export default useProfileForm;
