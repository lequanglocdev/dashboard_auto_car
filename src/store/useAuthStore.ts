import { authService } from '@/services/authService';

import type { AuthState } from "@/types/store"
import {toast} from "sonner"
import { create} from "zustand"

export const useAuthStore = create<AuthState>((set,get) =>({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => set({ accessToken }),
  clearState: () => set({ accessToken: null, user: null }),

  signUp: async (username, email, password) =>{
    try {
      set({ loading: true });
      await authService.signUp(username, email, password);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (error) {
      console.log(error)
      toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    // sign in logic here
      try {
        set({ loading: true });

        // Gọi API sign in
        const { accessToken } = await authService.signIn(email, password);
        get().setAccessToken(accessToken);

        // Lấy thông tin user
        await get().fetchMe();

        toast.success("Đăng nhập thành công!");
      } catch (error) {
        console.error("Sign in failed", error);
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
        throw error; //
      }  finally {
        set({ loading: false });
      }
  },

  signOut: async () =>{
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Đăng xuất thành công!"); 
    } catch (error) {
      console.log(error)
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  },

  fetchMe: async () =>{
    try {
      const user = await authService.fetchMe();
      set({ user });  
    } catch (error) {
      console.error("Fetch me failed", error);
      set({ user: null , accessToken: null  });
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    finally {
      set({ loading: false });
    }
  },

  refresh: async () =>{
    try {
      set({loading: true})
      const {user, fetchMe, setAccessToken} = get();
      const accessToken = await authService.refresh();
      setAccessToken(accessToken);
      if(!user){
        await fetchMe();
      }
     
    } catch (error) {
      console.error("Refresh token failed", error);
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."); 
      get().clearState();
    } finally {
      set({ loading: false });
    }
  }

}))
