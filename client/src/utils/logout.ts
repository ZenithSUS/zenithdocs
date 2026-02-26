import config from "@/config/env";

function handleLogout() {
  // Remove localStorage access
  localStorage.removeItem("accessToken");

  // Call backend logout
  fetch(`${config.api.baseUrl}/auth/logout`, {
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
