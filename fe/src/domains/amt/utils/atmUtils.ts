import { default_img } from "../../../common/utils/profile";

interface DataNode {
  nickname: string;
  imageUrl: string;
  isBlocked: boolean;
}

export interface Data {
  root: DataNode;
  levelOneNode: DataNode;
  parent: DataNode;
  target: DataNode;
  twoLevelChildCount: number;
  totalChildCount: number;
}

export const data: DataNode = {
  nickname: "nickname",
  imageUrl: default_img,
  isBlocked: false,
};
