import { Avatar } from "@chakra-ui/react";
import { DataNode } from "./atmUtils";

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
}

export const ProfileAvatar = ({
  ancestor,
  onHover,
  onLeave,
  onClick,
}: ProfileAvatarProps) => {
  return (
    <Avatar
      cursor={ancestor.isBlocked ? "not-allowed" : "pointer"}
      src={ancestor.isBlocked ? `images/profile.png` : ancestor.imageUrl}
      size="md"
      onMouseEnter={(event) => onHover(ancestor, event)}
      onMouseLeave={onLeave}
      onClick={onClick}
    />
  );
};