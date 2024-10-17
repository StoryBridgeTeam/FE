import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const chatServerAxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_HTTP_CHAT_SERVER,
    headers: {
        "Content-Type": "application/json",
    },
})

chatServerAxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;

            if(config.params && config.params.hasOwnProperty("token")){
                delete config.params.token;
            }
        }


        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

chatServerAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/token/refresh`,
                    { refreshToken },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const { accessToken } = refreshResponse.data.data;
                localStorage.setItem("accessToken", accessToken);
                chatServerAxiosInstance.defaults.headers[
                    "Authorization"
                    ] = `Bearer ${accessToken}`;
                return chatServerAxiosInstance(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export const videoServerAxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_VIDEO_SERVER,
    headers: {
        "Content-Type": "application/json",
    },
})

// videoServerAxiosInstance.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem("accessToken");
//         if (accessToken) {
//             config.headers["Authorization"] = `Bearer ${accessToken}`;
//
//             if(config.params && config.params.hasOwnProperty("token")){
//                 delete config.params.token;
//             }
//         }
//
//
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

export const llmAxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_LLM_SERVER,
    headers: {
        "Content-Type": "application/json",
    },
});

llmAxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;

            if(config.params && config.params.hasOwnProperty("token")){
                delete config.params.token;
            }
        }



        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setUpAxiosInstance = (errorStore:any) => {
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if(error.code=="ERR_CANCELED"){
                // errorStore.setError("사용자 차단", "상대방이 차단하여 조회할 수 없습니다.");
                // return {status:"canceled", message:error.message}
                return Promise.reject(error);
            }

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    const refreshResponse = await axios.post(
                        `${API_BASE_URL}/auth/token/refresh`,
                        { refreshToken },
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const { accessToken } = refreshResponse.data.data;
                    localStorage.setItem("accessToken", accessToken);
                    axiosInstance.defaults.headers[
                        "Authorization"
                        ] = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    return Promise.reject(err);
                }
            }else if(error.response.data.code==4030201){
                errorStore.setError("사용자 차단", "상대방이 차단하여 조회할 수 없습니다.");
                cancelSource.cancel('blocked');
                cancelSource = axios.CancelToken.source();
            }else if(error.response.data.code==4030001){
                errorStore.setError("명함 생성", "명함 생성을 해야 다른사람의 정보를 볼 수 있습니다.");
                cancelSource.cancel('blocked');
                cancelSource = axios.CancelToken.source();
            }

            return Promise.reject(error);
        }
    );
}


let cancelSource = axios.CancelToken.source();

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;

      if(config.params && config.params.hasOwnProperty("token")){
          delete config.params.token;
      }
    }

    config.cancelToken = cancelSource.token;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default axiosInstance;
