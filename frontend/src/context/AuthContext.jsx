import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(AuthService.getStoredUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!AuthService.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await AuthService.getCurrentUser();

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );

        setUser(currentUser);
      } catch {
        AuthService.logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(credentials) {
    const response = await AuthService.login(credentials);

    setUser(response.user);

    return response;
  }

  function logout() {
    AuthService.logout();
    setUser(null);
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}