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

export type CardType = "public" | "original";

export interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
}
