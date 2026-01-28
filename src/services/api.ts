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

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
};
