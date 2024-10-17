import {ImageRes} from "../../../common/hooks/useImage";

export interface DataNode {
  memberId : number,
  nickname : string,
  name : string,
  card :CardResponse | undefined,
  isHide: boolean,
  isBlocked: boolean;
  top?: number;
  left?: number;
}

export interface CardResponse{
  id : number,
  name : string,
  nickName : string,
  profileImage : ImageRes,
  entries : CardEntry[]
}

interface CardEntry{
  id : number,
  title : string,
  content : string,
  index : number,
  isVisibleBriefCard : boolean
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
  nickname : "",
  name : "",
  card : undefined,
  isBlocked: false,
  isHide:false,
};
