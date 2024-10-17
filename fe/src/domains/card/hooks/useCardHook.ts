import {useEffect, useState} from "react";
import {CardInfo, EntryState} from "../types/cardTypes";
import {useLocation} from "react-router-dom";
import {
    createCardInfo,
    getIsCreatedCard,
    getOriginalCardInfo,
    getPublicCardInfo,
    updateOriginalCardInfo,
    updatePublicCardInfo
} from "../api/cardAPI";
import {type} from "os";

const useCardHook = (nickName: string, detail=false): UseCardHookReturn => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token") || "";

    const [publicCardInfo, setPublicCardInfo] = useState<CardInfo>();
    const [originCardInfo, setOriginCardInfo] = useState<CardInfo>();
    const [currentCardInfo, setCurrentCardInfo] = useState<CardInfo>();

    const [loading, setLoading] = useState<boolean>(false);
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [type, setType] = useState<"PUBLIC" | "ORIGIN">("PUBLIC")
    const [profileCardId, setProfileCardId] = useState<number>();

    useEffect(() => {
        fetchPublicCard(true);
        checkCard();
    }, []);

    const fetchPublicCard = async (setCurrent: boolean) => {
        setLoading(true);
        const data = await getPublicCardInfo(nickName, detail ? "DETAIL" : "BRIEF", token);
        setPublicCardInfo(data.data);

        if (setCurrent) {
            setCurrentCardInfo(data.data);
            setType("PUBLIC");
        }

        setLoading(false);
    }

    const fetchOriginCard = async (setCurrent: boolean) => {
        setLoading(true);
        const data = await getOriginalCardInfo(nickName, detail ? "DETAIL" : "BRIEF", token);
        setOriginCardInfo(data.data);

        if (setCurrent) {
            setCurrentCardInfo(data.data);
            setType("ORIGIN");
        }

        setLoading(false);
    }

    const checkCard = async () => {
        setLoading(true);
        try {
            const data = await getIsCreatedCard(nickName, token);
            setIsCreated(data.data.isCreated);
            setProfileCardId(data.data.cardId);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPublicType = () => {
        fetchPublicCard(true);
    }

    const handleSelectOriginType = () => {
        fetchOriginCard(true);
    }


    const handleEntryChange = (reorderedEntries: EntryState[]) => {
        if (reorderedEntries.length == 0) return;

        if (currentCardInfo) {
            const newCardInfo = currentCardInfo;
            newCardInfo.entries = reorderedEntries;
            setCurrentCardInfo(newCardInfo);

            if(isCreated){
                updateCardEntries();
            }
        }else if(!isCreated){
            createCard(reorderedEntries);
        }
    }


    const handleDeisgnTypeChange = (type : string) => {
        if(!isCreated) return;

        if (currentCardInfo) {
            const newCardInfo = currentCardInfo;
            newCardInfo.designType = type;
            setCurrentCardInfo(newCardInfo);

            updateCardEntries();
        }

    }

    const updateCardEntries = () => {
        if (type == "PUBLIC") editPublicCard();
        else editOriginalCard();
    }
    const createCard = async (entries:EntryState[]) => {
        setLoading(true);
        try {
            const data = await createCardInfo(nickName, entries);
            setCurrentCardInfo(data.data);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const editOriginalCard = async () => {
        setLoading(true);
        try {
            if (currentCardInfo) {
                const entryStates = currentCardInfo.entries.filter(e => e.title.length!=0 && e.content.length!=0);
                const data = await updateOriginalCardInfo(nickName, currentCardInfo.designType, entryStates);
                setCurrentCardInfo(data.data);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const editPublicCard = async () => {
        setLoading(true);
        try {
            if (currentCardInfo) {
                const entryStates = currentCardInfo.entries.filter(e => e.title.length!=0 && e.content.length!=0);
                const data = await updatePublicCardInfo(nickName, currentCardInfo.designType, entryStates);
                setCurrentCardInfo(data.data);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    return {
        currentCardInfo,
        isCreated,
        loading,
        handleSelectPublicType,
        handleSelectOriginType,
        profileCardId,
        handleEntryChange,
        handleDeisgnTypeChange
    };
}

export interface UseCardHookReturn {
    currentCardInfo: CardInfo | undefined,
    isCreated: boolean,
    loading: boolean,
    handleSelectPublicType: () => void,
    handleSelectOriginType: () => void,
    profileCardId: number | undefined,
    handleEntryChange: (entries: EntryState[]) => void,
    handleDeisgnTypeChange : (type:string) => void
}

export default useCardHook;