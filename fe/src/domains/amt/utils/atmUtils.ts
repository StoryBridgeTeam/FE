import {ImageRes} from "../../../common/hooks/useImage";

export interface DataNode {
  nickname: string;
  profileImage?: ImageRes;
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
  profileImage: undefined,
  isBlocked: false,
};
