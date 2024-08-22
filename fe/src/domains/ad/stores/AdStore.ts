import create from "zustand";

interface Ad {
  id: number;
  content: string;
}

interface AdStore {
  ads: Ad[];
  setAds: (ads: Ad[]) => void;
  fetchAds: () => Promise<void>;
}

export const useAdStore = create<AdStore>((set) => ({
  ads: [],
  setAds: (ads) => set({ ads }),
  fetchAds: async () => {
    // 여기에 실제 API 호출 로직을 추가할 수 있습니다.
    const dummyAds = [
      { id: 1, content: "광고 1" },
      { id: 2, content: "광고 2" },
      { id: 3, content: "광고 3" },
      { id: 4, content: "광고 4" },
    ];
    set({ ads: dummyAds });
  },
}));
