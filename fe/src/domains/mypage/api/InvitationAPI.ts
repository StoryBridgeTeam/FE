import axiosInstance from "../../../common/api/axiosInstance";

export const fetchInvitations = async (page : number, size:number) => {
    const response = await axiosInstance.get(`/members/my-page/invitation-tickets?page=${page}&size=${size}`);
    return response.data.data;
}