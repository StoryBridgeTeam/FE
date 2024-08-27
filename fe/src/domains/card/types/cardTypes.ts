// export interface EntryState {
//   id: number;
//   title: string;
//   content: string;
//   index: number;
//   isVisibleBriefCard: boolean;
// }

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

export interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}

export interface FirstCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickName: string;
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
