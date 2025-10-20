import { createContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

export const UserContext = createContext();
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null); // timestamp in ms

  const saveTokens = async (token, refresh, expiresIn) => {
    const expiryTime = Date.now() + expiresIn * 1000;
    await AsyncStorage.multiSet([
      ["accessToken", token],
      ["refreshToken", refresh],
      ["expiresAt", expiryTime.toString()],
    ]);
    setAccessToken(token);
    setRefreshToken(refresh);
    setExpiresAt(expiryTime);

    const decoded = jwtDecode(token);
    setUser(decoded); // assumes payload contains user info (id, email, etc.)
  };

  async function login(email, password) {
    try {
      console.log(API_URL+"/auth/login");
      const response = await fetch(API_URL+"/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      await saveTokens(data.data.accessToken, data.data.refreshToken, data.data.expiresIn);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async function register(profilePicture,email, password, firstName,lastName, countryCode, phoneNumber,dateOfBirth,gender,country,city, role) {
    try {
      const response = await fetch(API_URL+"/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({profilePicture, email, password, firstName,lastName, countryCode, phoneNumber,dateOfBirth,gender,country,city, role }),
      });

      if (!response.ok) throw new Error("Register failed: ",response);

      // login after register
      await login(email, password);
    } catch (error) {
      throw Error(error.message);
    }
  }

  async function logout() {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "expiresAt"]);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
  }

  // 🔄 Refresh token
  const refresh = useCallback(async () => {
    if (!refreshToken) return logout();

    try {
      const response = await fetch(API_URL+"/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      await saveTokens(data.accessToken, data.refreshToken, data.expiresIn);
    } catch (err) {
      await logout();
    }
  }, [refreshToken]);

  // Check stored tokens on app start
  async function getInitialUserValue() {
    try {
      const [[, storedAccess], [, storedRefresh], [, storedExpiry]] =
        await AsyncStorage.multiGet([
          "accessToken",
          "refreshToken",
          "expiresAt",
        ]);

      if (!storedAccess || !storedRefresh || !storedExpiry) {
        setUser(null);
        return;
      }

      const expiryTime = parseInt(storedExpiry, 10);

      if (Date.now() > expiryTime - 60000) {
        // expired or within 1 min of expiry → refresh
        await saveTokens(storedAccess, storedRefresh, 0); // temp set for state
        await refresh();
      } else {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setExpiresAt(expiryTime);

        const decoded = jwtDecode(storedAccess);
        setUser(decoded);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setAuthChecked(true);
    }
  }

  // Setup background refresh
  useEffect(() => {
    getInitialUserValue();
  }, []);

  // Every 30s check if we need to refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (expiresAt && Date.now() > expiresAt - 60000) {
        refresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [expiresAt, refresh]);

  return (
    <UserContext.Provider
      value={{ user, accessToken, refreshToken, login, register, logout, authChecked }}
    >
      {children}
    </UserContext.Provider>
  );
}
