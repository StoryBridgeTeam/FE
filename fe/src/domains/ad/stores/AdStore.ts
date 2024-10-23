import create from "zustand";
import {ReactNode} from "react";

interface Ad {
  id: number;
  code : string,
  width : number,
  height : number
}

interface AdStore {
  desktopAds: Ad[];
  mobileAds : Ad[]
}

export const useAdStore = create<AdStore>((set) => ({
  desktopAds: [
    { id: 1, code:"DAN-lNsvtWhE2kHG5VCh", width:300, height:250},
    { id: 2, code:"DAN-Qn08yiR50lay3Bl1", width:300, height:250},
    { id: 2, code:"DAN-XgxbMfDBeeNAfXmq", width:300, height:250},
  ],
  mobileAds : [
    { id: 1, code:"DAN-aRe3tlh9DiYnV8C0", width:320, height:150},
    { id: 2, code:"DAN-0g9UbGS8DIYyDqnC", width:320, height:150},
    { id: 2, code:"DAN-SXj3EyGevnY0Hg9F", width:320, height:150},
  ]
}));