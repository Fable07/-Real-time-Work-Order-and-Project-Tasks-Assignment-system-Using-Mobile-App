// ─────────────────────────────────────────
// AUTH CONTEXT
// Global authentication state manager
// ─────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────
type User = {
  id: string;
  fullName: string;
  role: string;
  employeeNo: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
};

// ─────────────────────────────────────────
// CONTEXT INITIALIZATION
// ─────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ─────────────────────────────────────────
// AUTH PROVIDER
// ─────────────────────────────────────────
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session from AsyncStorage on app launch
  useEffect(() => {
    const restore = async () => {
      const t = await AsyncStorage.getItem("token");
      const u = await AsyncStorage.getItem("user");
      if (t && u) {
        setToken(t);
        setUser(JSON.parse(u));
      }
    };
    restore();
  }, []);

  // Save user and token on login
  const login = async (user: User, token: string) => {
    setUser(user);
    setToken(token);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };

  // Clear user and token on logout
  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
