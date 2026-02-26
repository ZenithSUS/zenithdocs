import config from "@/config/env";

function handleLogout() {
  // Remove localStorage access and refresh token
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  // Call backend logout
  fetch(`${config.api.baseUrl}/api/auth/logout`, {
    method: "POST",
    credentials: "include", // sends httpOnly cookie
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.api.key,
    },
  }).catch(() => {});

  // Redirect to login
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export default handleLogout;
