const BASE_URL = "https://joyous-ivory-ijse-1522b5af.koyeb.app";

export const apiRequest = async (
  endpoint: string,
  method: string = "GET",
  body?: any
) => {
  const token = localStorage.getItem("accessToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // --- THE SYNC FIX ---
  // If the endpoint doesn't already start with our required prefix, add it.
  const prefix = "/api/progresso";
  const formattedEndpoint = endpoint.startsWith(prefix)
    ? endpoint
    : `${prefix}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  // --------------------

  const response = await fetch(`${BASE_URL}${formattedEndpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // Catch cases where the server doesn't return JSON to prevent a crash
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error ${response.status}: Something went wrong`
    );
  }

  return response.json();
};
