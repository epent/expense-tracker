import React, { useState, useContext, createContext, useEffect } from "react";

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      setToken(authToken);
    }
  }, []);

  return {
    token,
  };
}
