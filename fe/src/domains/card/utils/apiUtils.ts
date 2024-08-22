import { EntryState, EntryStateForAPI } from "../types/cardTypes";

//임시id의 temp엔트리들의 id를 모두 null로 변경한다.
export const prepareEntriesForAPI = (
  entries: EntryState[]
): EntryStateForAPI[] => {
  return entries.map((entry) => ({
    ...entry,
    id: (entry.id as number) < 0 ? null : entry.id,
  }));
};
