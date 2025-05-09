import Cookies from "js-cookie";
import base64 from "base-64";

export const getNicknameToken = () => {
  const accessToken = Cookies.get("accessToken") || "";

  if (accessToken.split(".").length !== 3) {
    console.error("Invalid access token format");
    return null;
  }

  const payload = accessToken.substring(
    accessToken.indexOf(".") + 1,
    accessToken.lastIndexOf(".")
  );

  try {
    const decodingInfo = base64.decode(payload);

    const decodingInfoJson = JSON.parse(decodingInfo);

    if (decodingInfoJson.nickname) {
      return decodingInfoJson.nickname;
    } else {
      console.warn("Nickname not found in token payload");
      return null;
    }
  } catch (error) {
    console.error("Error decoding or parsing token payload", error);
    return null;
  }
};
