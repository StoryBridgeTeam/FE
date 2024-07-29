import Cookies from "js-cookie";
import base64 from "base-64";

export const getNicknameToken = () => {
  const accessToken = Cookies.get("accessToken") || "";

  let payload = accessToken.substring(
    accessToken.indexOf(".") + 1,
    accessToken.lastIndexOf(".")
  );
  let decodingInfo = base64.decode(payload);
  let decodingInfoJson = JSON.parse(decodingInfo);
  if (decodingInfoJson.nickname) {
    return decodingInfoJson.nickname;
  } else {
    return null;
  }
};
