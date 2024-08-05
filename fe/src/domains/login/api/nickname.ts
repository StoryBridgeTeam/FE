import Cookies from "js-cookie";
import base64 from "base-64";

export const getNicknameToken = () => {
  const accessToken = Cookies.get("accessToken") || "";

  // accessToken에 '.'이 두 개 포함되어 있어야 함
  if (accessToken.split(".").length !== 3) {
    console.error("Invalid access token format");
    return null;
  }

  const payload = accessToken.substring(
    accessToken.indexOf(".") + 1,
    accessToken.lastIndexOf(".")
  );

  // Base64 디코딩 및 JSON 파싱
  try {
    // Base64 디코딩
    const decodingInfo = base64.decode(payload);

    // 디코딩된 문자열을 JSON으로 파싱
    const decodingInfoJson = JSON.parse(decodingInfo);

    // 닉네임이 존재하는지 확인
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
