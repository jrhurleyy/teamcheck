const getApiBaseUrl = () => {
  const currentHost = window.location.hostname;

  if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
    return `http://${currentHost}:3001`;
  }

  return "http://localhost:3001";
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = getApiBaseUrl();

console.log("API Base URL:", API_BASE_URL);
console.log("Socket URL:", SOCKET_URL);
