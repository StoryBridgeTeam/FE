import {useEffect, useState} from "react";
import {fetchInvitations} from "../api/InvitationAPI";
import {ImageRes} from "../../../common/hooks/useImage";


interface Invitation {
    code: string,
    createdAt: string,
    expiredTime: string,
    isJoined: boolean,
    isUsedComment: boolean,
    type : string,
    member : {
        name : string,
        nickname : string,
        profileImage : ImageRes | null
    } | null
}

const useInvitationHook = () => {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageInfo, setPageInfo] = useState<
        { page: number, size: number, totalPage: number }
    >({
        page : 0,
        size : 5,
        totalPage : 0
    });

    useEffect(() => {
        fetchInvitation(0, 5);
    }, []);

    const fetchInvitation = async (page: number, size: number) => {
        setLoading(true);
        const data = await fetchInvitations(page, size);
        setInvitations(data.content);
        setPageInfo({
            page : data.number,
            size : data.size,
            totalPage : data.totalPages
        })
        setLoading(false);
    };

    return {
        invitations,
        loading,
        pageInfo,
        fetchInvitation
    }
}

export default useInvitationHook;