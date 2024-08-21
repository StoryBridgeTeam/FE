import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import {
  getMyPageInfo,
  updateNickname,
  updatePassword,
  requestEmailVerification,
} from "../api/MypageAPI";

const useProfileForm = () => {
  const toast = useToast();
  const [profile, setProfile] = useState({
    nickname: "",
    email: "",
    originPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyPageInfo();
        setProfile({
          nickname: data.nickname || "",
          email: data.email || "",
          originPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setImage(data.image || "");
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

    fetchProfile();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
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
  };
};

export default useProfileForm;
