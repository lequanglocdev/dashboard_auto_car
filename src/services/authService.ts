import api from "@/lib/axios";

export const authService = {
  signUp: async (username: string, email: string, password: string) => {
    // Implementation for signing up a user
    const res = await api.post(
      "/auth/signup",
      { username, email, password },
      { withCredentials: true }
    );
    return res.data;
  },
  signIn: async (email: string, password: string) => {
    const res = await api.post(
      "/auth/signin",
      { email, password },
      { withCredentials: true }
    );
    return res.data;
  },
  signOut: async () => {
    return api.post("/auth/signout", {}, { withCredentials: true });
  },

  fetchMe: async () => {
    const res = await api.get("/user/me", { withCredentials: true });
    return res.data.user;
  },
  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data.accessToken;
  },
};
