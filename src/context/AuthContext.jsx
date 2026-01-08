import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate auth persistence (Firebase-ready)
  useEffect(() => {
    const isAuth = localStorage.getItem("optima_auth") === "true";
    if (isAuth) setUser({ name: "Demo User" });
    setLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem("optima_auth", "true");
    setUser({ name: "Demo User" });
  };

  const logout = () => {
    localStorage.removeItem("optima_auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
