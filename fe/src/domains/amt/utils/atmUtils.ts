import { default_img } from "../../../common/utils/profile";

export interface DataNode {
  nickname: string;
  imageUrl: string;
  isBlocked: boolean;
  top?: number;
  left?: number;
}

export interface Data {
  root: DataNode;
  levelOneNode: DataNode;
  parent: DataNode;
  target: DataNode;
  child: DataNode[];
  twoLevelChild: DataNode[];
  twoLevelChildCount: number;
  totalChildCount: number;
}

export const data: DataNode = {
  nickname: "nickname",
  imageUrl: default_img,
  isBlocked: false,
};

export const datalist: DataNode[] = [
  {
    nickname: "nickname",
    imageUrl: default_img,
    isBlocked: false,
  },{
    nickname: "nickname",
    imageUrl: default_img,
    isBlocked: false,
  },{
    nickname: "nickname",
    imageUrl: default_img,
    isBlocked: false,
  },{
    nickname: "nickname",
    imageUrl: default_img,
    isBlocked: false,
  },{
    nickname: "nickname",
    imageUrl: default_img,
    isBlocked: false,
  },{
    nickname: "nickname",
    imageUrl: default_img,
    isBlocked: false,
  }
]