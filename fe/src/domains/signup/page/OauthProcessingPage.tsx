import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useAuthStore} from "../../../common/stores/AuthStore";
import {loginOauth} from "../api/oauthAPI";
import {useToastMessage} from "../../../common/hooks/useToastMessage";

const OauthProcessingPage = () => {
    const {login} = useAuthStore();

    const navigate = useNavigate();
    const {showToast} = useToastMessage();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status")||"";
    const code = queryParams.get("code") || "";
    const atoken = queryParams.get("atoken") || "";

    useEffect(() => {
        if(status=="success"){
            handleLogin();
        }

        if(status=="error"){
            // if(code=="401001"){
                showToast("로그인 실패", "회원가입 되지 않은 계정입니다.", "error");
                navigate("/login")
            // }
        }
    }, []);

    const handleLogin = async () => {
        const {accessToken, refreshToken, nickname, memberId, profileImage} = await loginOauth(atoken);

        await login(
            accessToken,
            refreshToken,
            false,
            nickname,
            memberId,
            profileImage
        );

        navigate(`/${nickname}`);
    }

    return <></>
}

export default OauthProcessingPage;