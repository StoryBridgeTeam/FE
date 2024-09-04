import {Avatar, AvatarBadge, Box, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import { DataNode } from "./atmUtils";
import { milliseconds } from "date-fns";
import React, {LegacyRef, useEffect, useRef, useState} from "react";
import {ViewOffIcon} from "@chakra-ui/icons";

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
  hideUser : (nickname:string) => void,
  unHideUser : (nickname:string) => void,
  isHost : boolean,
  isAmtOwner ?: boolean,
}

export const ProfileAvatar = ({
  ancestor,
  onHover,
  onLeave,
  hideUser,
  unHideUser,
    isHost,
  onClick,isAmtOwner=false
}: ProfileAvatarProps) => {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleRightClick = (e:any) => {
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
        border={isAmtOwner ? "2px solid red" : "none"}
      cursor={isHost ? "pointer" : (ancestor.isBlocked ? "not-allowed" : "pointer")}
      src={
        ancestor.profileImage
          ? `http://image.storyb.kr/${ancestor.profileImage.path}`
          : `/images/profile.png`
      }
      size="md"
      onMouseEnter={(event) => onHover(ancestor, event)}
      onMouseLeave={onLeave}
      onClick={onClick}
      onContextMenu={handleRightClick}
    >
      {
        isHost && ancestor.isBlocked &&
          <>
            <AvatarBadge border={"1px solid grey"} bg={"white"}  boxSize={"1em"}>
              <ViewOffIcon color={"grey"} fontSize={13}/>
            </AvatarBadge>
          </>
      }
    </Avatar>
    {
      !isAmtOwner &&
        <Menu isOpen={isOpen}>
          <MenuButton position={"relative"} left={-6} top={-1}></MenuButton>
          {
              isHost &&
              <MenuList bg={"white"} zIndex={999}>
                {
                    !ancestor.isBlocked &&
                    <MenuItem fontSize={14} onClick={() => {
                      hideUser(ancestor.nickname);
                      setIsOpen(false);
                    }}>AMT에서 가리기</MenuItem>
                }
                {
                    ancestor.isBlocked  &&
                    <MenuItem fontSize={14} onClick={() => {
                      unHideUser(ancestor.nickname);
                      setIsOpen(false);
                    }}>AMT에서 보이기</MenuItem>
                }
              </MenuList>
          }
        </Menu>
    }
    </Box>
};
