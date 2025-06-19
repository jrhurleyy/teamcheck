// Get the current host from window.location
const getApiBaseUrl = () => {
  const currentHost = window.location.hostname;

  // If accessing via network IP, use that IP for backend
  if (currentHost !== "localhost" && currentHost !== "127.0.0.1") {
    return `http://${currentHost}:3001`;
  }

  // Default to localhost for local development
  return "http://localhost:3001";
};

export const API_BASE_URL = getApiBaseUrl();
export const SOCKET_URL = getApiBaseUrl();

console.log("API Base URL:", API_BASE_URL);
console.log("Socket URL:", SOCKET_URL);
