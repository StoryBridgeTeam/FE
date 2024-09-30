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

axiosInstance.interceptors.request.use(
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

axiosInstance.interceptors.response.use(
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
        axiosInstance.defaults.headers[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
