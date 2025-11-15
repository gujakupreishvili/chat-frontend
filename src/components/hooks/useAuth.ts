import { useEffect, useState } from "react";
import { Cookies } from "react-cookie";
import {jwtDecode} from "jwt-decode";
import type { DecodedToken } from "../../types/chatTypes";

export const useAuth = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const cookieToken = new Cookies().get("token");
    setToken(cookieToken);

    if (!cookieToken) return;

    try {
      const decoded = jwtDecode<DecodedToken>(cookieToken);
      setCurrentUserId(decoded.id);
    } catch (error) {
      console.error("❌ Invalid token:", error);
    }
  }, []);

  return { currentUserId, token };
};
