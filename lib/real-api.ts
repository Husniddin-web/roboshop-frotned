import axios from "axios";

const URL = process.env.NEXT_PUBLIC_API_URL;
const instance = axios.create({
  baseURL: URL,
});

instance.interceptors.request.use((config) => {
  const lang = localStorage.getItem("i18nextLng") || "uz";
  config.headers["lang"] = lang;
  return config;
});

export default instance;
