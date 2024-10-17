import {Avatar, AvatarBadge, Box, HStack, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {DataNode} from "./atmUtils";
import {milliseconds} from "date-fns";
import React, {LegacyRef, useEffect, useRef, useState} from "react";
import {NotAllowedIcon, ViewOffIcon} from "@chakra-ui/icons";
import {useAuthStore} from "../../../common/stores/AuthStore";
import {useNavigate} from "react-router-dom";

export interface Card {
    id: number;
    title: string;
    content: string;
}

export interface ProfileAvatarProps {
    ancestor: DataNode;
    onHover: (ancestor: DataNode, event: React.MouseEvent) => void;
    onLeave: () => void;
    onClick: () => void;
    hideUser: (nickname: string) => void,
    unHideUser: (nickname: string) => void,
    blockUser: (nickname: string) => void,
    unblockUser: (nickname: string) => void,
    isHost: boolean,
    isHidable?: boolean,
    isAmtOwner?: boolean,
}

export const ProfileAvatar = ({
                                  ancestor,
                                  onHover,
                                  onLeave,
                                  hideUser,
                                  unHideUser,
                                  blockUser, unblockUser,
                                  isHost,
                                  isHidable = false,
                                  onClick, isAmtOwner = false
                              }: ProfileAvatarProps) => {
    const dropDownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const nickname = localStorage.getItem("nickName");

    const {isTokenUser} = useAuthStore();

    const handleRightClick = (e: any) => {
        e.preventDefault();
        onLeave();
        setIsOpen(true);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return <Box
        ref={dropDownRef}
    >
        <Avatar
            border={isAmtOwner ? "3px solid green" : "0.5px solid grey"}
            cursor={isHost ? "pointer" : (ancestor.isHide || ancestor.nickname == null ? "not-allowed" : "pointer")}
            src={
                ancestor?.card?.profileImage
                    ? `http://image.storyb.kr/${ancestor.card.profileImage.path}`
                    : `/images/profile.png`
            }
            size="md"
            onMouseEnter={(event) => onHover(ancestor, event)}
            onMouseLeave={onLeave}
            onClick={onClick}
            onContextMenu={handleRightClick}
        >
            {
                ( (isHost && ancestor.isHide) || ancestor.isBlocked) &&
                <AvatarBadge placement={"bottom-end"} border={"0.5px solid grey"} bg={"white"} padding={"0.2em"}>
                    {
                        isHost && ancestor.isHide && <ViewOffIcon color={"grey"} fontSize={10} mr={ancestor.isBlocked ? 1 : 0}/>
                    }
                    {
                        ancestor.isBlocked &&
                        <NotAllowedIcon color={"red"} fontSize={10}/>
                    }
                </AvatarBadge>
            }
        </Avatar>
        <Menu isOpen={isOpen}>
            <MenuButton position={"relative"} left={-6} top={-1}></MenuButton>
            {
                !isTokenUser && nickname!=ancestor.nickname &&
                <MenuList bg={"white"} zIndex={999}>
                    {
                        isHost && !ancestor.isHide && isHidable &&
                        <MenuItem fontSize={14} onClick={() => {
                            hideUser(ancestor.nickname);
                            setIsOpen(false);
                        }}>AMT에서 가리기</MenuItem>
                    }
                    {
                        isHost && ancestor.isHide && isHidable &&
                        <MenuItem fontSize={14} onClick={() => {
                            unHideUser(ancestor.nickname);
                            setIsOpen(false);
                        }}>AMT에서 보이기</MenuItem>
                    }
                    {
                        !ancestor.isBlocked &&
                        <MenuItem fontSize={14} onClick={() => {
                            blockUser(ancestor.nickname)
                            setIsOpen(false);
                        }}>차단하기</MenuItem>
                    }
                    {
                        ancestor.isBlocked &&
                        <MenuItem fontSize={14} onClick={() => {
                            unblockUser(ancestor.nickname)
                            setIsOpen(false);
                        }}>차단해제</MenuItem>
                    }
                    <MenuItem fontSize={14} onClick={() => {
                        navigate('/chat', {state:{targetId:ancestor.memberId}})
                    }}>채팅</MenuItem>
                </MenuList>
            }
        </Menu>
    </Box>
};
