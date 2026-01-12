import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken) => set({ accessToken }),
      setUser: (user) => set({ user }),

      clearState: () =>
        set({
          accessToken: null,
          user: null,
          loading: false,
        }),

      signUp: async (username, email, password) => {
        try {
          set({ loading: true });
          await authService.signUp(username, email, password);
          toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        } catch (error) {
          console.error(error);
          toast.error("Đăng ký thất bại. Vui lòng thử lại.");
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email, password) => {
        try {
          set({ loading: true });

          const { accessToken } = await authService.signIn(email, password);
          set({ accessToken });

          await get().fetchMe();

          toast.success("Đăng nhập thành công!");
        } catch (error) {
          console.error("Sign in failed", error);
          get().clearState();
          toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          await authService.signOut();
        } catch (error) {
          console.error(error);
        } finally {
          get().clearState();
          toast.success("Đăng xuất thành công!");
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await authService.fetchMe();
          set({ user });
        } catch (error) {
          console.error("Fetch me failed", error);
          throw error; // ⬅️ KHÔNG clear state ở đây
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });

          const accessToken = await authService.refresh();
          set({ accessToken });

          if (!get().user) {
            await get().fetchMe();
          }
        } catch (error) {
          console.error("Refresh token failed", error);
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        accessToken: state.accessToken, // ✅ chỉ lưu accessToken
      }),
    }
  )
);
