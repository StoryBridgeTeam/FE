import {UseCardResult} from "../hooks/useCard";

export interface CardInfo{
  id:number,
  name:string,
  entries:EntryState[]
}
export interface EntryState {
  id: number;
  title: string;
  content: string;
  index: number;
  isVisibleBriefCard: boolean;
}

export interface EntryStateForAPI {
  id: number | null;
  title: string;
  content: string;
  index: number;
  isVisibleBriefCard: boolean;
}

export type FetchType = "BRIEF" | "DETAIL";
export type CardType = "ORIGINAL" | "PUBLIC";
export type ModalTabType = "명함" | "댓글";

export interface CardViewProps {
  nickName: string;
  useCardHook:UseCardResult
}

export interface FirstCardModalProps {
  nickName: string;
  useCardHook : UseCardResult
}

export interface ModalElementProps {
  cardType: CardType | "NEW";
  isEditing: boolean;
  nickName: string;
  entries: EntryState[];
  setIsEditing: (isEditing: boolean) => void;
  setEntries: (entries: EntryState[]) => void;
}

export interface CardModalListProps {
  name?:string,
  isEditing: boolean;
  entries: EntryState[];
  setEntries: (entries: EntryState[]) => void;
}

export interface CardModalItemProps {
  entry: EntryState;
  isEditing: boolean;
  onChangeEntry: (id: number, updatedEntry: Partial<EntryState>) => void;
  onDeleteEntry: (id: number) => void;
}
