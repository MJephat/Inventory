import api from "./api";

const AuthService = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);

    const { access_token, user } = response.data;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get("/auth/me");

    return response.data;
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },

  getStoredUser() {
    const user = localStorage.getItem("user");

    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};

export default AuthService;