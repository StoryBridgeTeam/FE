import axiosInstance from "../../../common/api/axiosInstance";
import {data} from "../../amt/utils/atmUtils";
import {config} from "date-fns/docs/config";

export const fetchTempInfo = async (oid:number, otoken:string) => {
    try{
        const response = await axiosInstance.get(`/oauth/temp-info/${oid}?otoken=${otoken}`);

        return response.data.data;
    }catch (e){
        console.error(e);
    }
}

export const registerOauthAccount = async (inviteToken:string, oid:number, otoken:string, nickname:string, password:string) => {
    try{
        axiosInstance.post(`/oauth/accounts?token=${inviteToken}`,{
            tokenId : oid,
            token : otoken,
            nickname: nickname,
            password:password
        })
    }catch (e){
        console.error(e);
    }
}

export const loginOauth = async (accessToken : string) => {
    try{
        const response = await axiosInstance.post(`/oauth/login`,
            {},
            {
                headers:{
                    Authorization : `Bearer ${accessToken}`
                }
            }
        )

        return response.data.data;
    }catch (e){
        console.error(e);
    }
}

export const fetchMySelectAccounts = async (oid:number, otoken:string) => {
    try{
        const response = await axiosInstance.get(`/oauth/accounts/select?tokenId=${oid}&otoken=${otoken}`)

        return response.data.data;
    }catch (e){
        console.error(e);
    }
}

export const linkMySelectAccounts = async (oid:number, otoken:string, accountId:number) => {
    try{
        const response = await axiosInstance.post(`/oauth/accounts/select`,{
            tokenId:oid,
            token:otoken,
            accountId:accountId
        })

        return response.data.data;
    }catch (e){
        console.error(e);
    }
}
