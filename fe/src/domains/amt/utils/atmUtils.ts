import {ImageRes} from "../../../common/hooks/useImage";

export interface DataNode {
  memberId : number,
  nickname: string;
  profileImage?: ImageRes;
  isHide: boolean,
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
  memberId : -1,
  nickname: "nickname",
  profileImage: undefined,
  isBlocked: false,
  isHide:false,
};
