import {create} from "zustand";
import {ImageRes} from "../hooks/useImage";
import {persist} from "zustand/middleware";

interface AuthState {
    isAuthenticated: boolean;
    isTokenUser: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    memberId : number | null,
    nickName: string;
    profileImage: ImageRes | null,
    login: (
        accessToken: string,
        refreshToken: string,
        rememberMe: boolean,
        nickName: string,
        memberId:number,
        profileImage: ImageRes
    ) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

// export const useAuthStore = create<AuthState>((set) => ({
//   isAuthenticated: false,
//   isTokenUser:false,
//   accessToken: null,
//   refreshToken: null,
//   nickName: "",
//   profileImage:null,
//   login: (
//     accessToken: string,
//     refreshToken: string,
//     rememberMe: boolean,
//     nickName: string,
//     profileImage:ImageRes
//   ) => {
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);
//     localStorage.setItem("nickName", nickName);
//     set({ isAuthenticated: true, accessToken, refreshToken, nickName,profileImage });
//   },
//   logout: () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("nickName");
//     set({
//       isAuthenticated: false,
//       accessToken: null,
//       refreshToken: null,
//     });
//   },
//   checkAuth: async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     const refreshToken = localStorage.getItem("refreshToken");
//     const nickName = localStorage.getItem("nickName");
//
//     if (accessToken && refreshToken && nickName) {
//       set({ isAuthenticated: true, isTokenUser:false, accessToken, refreshToken });
//     } else {
//       const queryParams = new URLSearchParams(window.location.search);
//       const token = queryParams.get("token");
//
//       if (token) {
//         set({
//           isAuthenticated: true,
//           isTokenUser:true,
//           accessToken: null,
//           refreshToken: null,
//         });
//       } else {
//         set({
//           isAuthenticated: false,
//           isTokenUser:false,
//           accessToken: null,
//           refreshToken: null,
//         });
//       }
//     }
//   },
// }));


export const useAuthStore = create(persist<AuthState>((set) => ({
        isAuthenticated: false,
        isTokenUser: false,
        accessToken: null,
        refreshToken: null,
        memberId:null,
        nickName: "",
        profileImage: null,
        login: (
            accessToken: string,
            refreshToken: string,
            rememberMe: boolean,
            nickName: string,
            memberId : number,
            profileImage: ImageRes
        ) => {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("nickName", nickName);
            set({isAuthenticated: true, accessToken, refreshToken, nickName, profileImage, memberId});
        },
        logout: () => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("nickName");
            set({
                isAuthenticated: false,
                accessToken: null,
                refreshToken: null,
            });
        },
        checkAuth: async () => {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
            const nickName = localStorage.getItem("nickName");

            if (accessToken && refreshToken && nickName) {
                set({isAuthenticated: true, isTokenUser: false, accessToken, refreshToken});
            } else {
                const queryParams = new URLSearchParams(window.location.search);
                const token = queryParams.get("token");

                if (token) {
                    set({
                        isAuthenticated: true,
                        isTokenUser: true,
                        accessToken: null,
                        refreshToken: null,
                    });
                } else {
                    set({
                        isAuthenticated: false,
                        isTokenUser: false,
                        accessToken: null,
                        refreshToken: null,
                    });
                }
            }
        },
    }),
    {
        name:"authStorage"
    }
));
