import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  const login = (jwtToken) => {
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userName");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider in same module
export function useAuth() {
  return useContext(AuthContext);
}
