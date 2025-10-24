import { createContext, useEffect, useState, useCallback, useRef } from "react";
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
    const expiryTime = Date.now() + expiresIn;
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
  const validateToken = async (token) => {
    try {
      const response = await fetch(API_URL + "/auth/check-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
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

  const refreshTokenRef = useRef(refreshToken);

  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  // 🔄 Refresh token
  const refresh = useCallback(async () => {
    if (!refreshToken) return logout();

    try {
      console.log("Inside Refresh");
      const response = await fetch(API_URL+"/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Refresh failed");

      const data = await response.json();
      console.log("Refresh Token => ", data);
      await saveTokens(data.data.accessToken, data.data.refreshToken, data.data.expiresIn);
    } catch (err) {
      await logout();
    }
  },);

  // Check stored tokens on app start
  async function getInitialUserValue() {
    try {
      // await logout()
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

      
      const isValid = await validateToken(storedAccess);
      if (!isValid) {
        console.log("Invalid/Expired Token! Logging out!")
        await logout();
        return;
      }

      const expiryTime = parseInt(storedExpiry, 10);
      // console.log("Expiry Time => ", user.exp)
      // console.log("Current Time => ", Date.now()/1000)
      console.log("Token Expiring in ", (expiryTime - Date.now() - 600000)/60000," minutes")
      console.log(storedAccess);
      console.log(storedExpiry);

      if (Date.now() > expiryTime - 600000) {
        console.log("Calling Refresh Token")
        // expired or within 1 min of expiry → refresh
        // await saveTokens(storedAccess, storedRefresh, 0); // temp set for state
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setExpiresAt(expiryTime);
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
      console.log("Check for Token Expiry...")
      console.log("Time to renewal: ",(expiresAt - Date.now() - 600000)/60000, " minutes");
      if (expiresAt && Date.now() > expiresAt - 600000) {
        refresh();
      }
    }, 300000);

    
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
