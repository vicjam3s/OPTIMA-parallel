import { createContext, useContext } from "react";

const FakeAuthContext = createContext();

export function FakeAuthProvider({ children }) {
  const user = {
    name: "Guest Student",
  };

  return (
    <FakeAuthContext.Provider value={{ user }}>
      {children}
    </FakeAuthContext.Provider>
  );
}

export const useAuth = () => useContext(FakeAuthContext);
