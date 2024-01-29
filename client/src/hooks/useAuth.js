import { useCallback } from "react";
import { useCookies } from "react-cookie";

const useAuth = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "token",
    "user",
    "name",
  ]);

  const login = (temp_token, username, name) => {
    setCookie("token", temp_token, { path: "/" });
    setCookie("user", username, { path: "/" });
    setCookie("name", name, { path: "/" });
  };

  const logout = () => {
    removeCookie("token", { path: "/" });
    removeCookie("user", { path: "/" });
    removeCookie("name", { path: "/" });
  };

  return { cookies, login, logout };
};

export default useAuth;
