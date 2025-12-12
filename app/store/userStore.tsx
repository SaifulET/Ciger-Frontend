import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { getEmail, setEmail, unauthorized } from "../utility/utility";

interface UserInfo {
  _id: string;
  email: string;
  image?: string;
  firstName: string;
  lastName: string;
}

interface UserStoreState {
  isLoggedIn: boolean;
  user: string;
  isLogin: () => boolean;
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;

  // Login
  loginFormData: { email: string };
  loginOnChange: (name: string, value: string) => void;

  // OTP
  OtpFormData: { otp: string };
  OtpOnChange: (name: string, value: string) => void;

  isFormSubmit: boolean;
  UserLoginRequest: (
    email: string,
    password: string
  ) => Promise<{
    status: "success" | "error";
    message?: string;
    token?: string;
  }>;
  UserSignupRequest: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ status: "success" | "error" | "false"; message?: string }>;

  UserForgetPasswordRequest: (email: string) => Promise<{
    status: "success" | "error";
    message?: string;
    token?: string;
  }>;

  VerifyOtpRequest: (
    otp: string
  ) => Promise<{ status: "success" | "error"; message?: string }>;

  UserNewPassword: (
    password: string,
    confirmPassword: string
  ) => Promise<{ status: "success" | "error" | "false"; message?: string }>;

  UserLogoutRequest: () => Promise<string>;
}

const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      // ---- Auth ----
      user: "",
      isLoggedIn: !!Cookies.get("token"),
      isLogin: () => !!Cookies.get("token"),
      userInfo: null,
      setUserInfo: (info) => set({ userInfo: info }),

      // ---- Login ----
      loginFormData: { email: "" },
      loginOnChange: (name, value) => {
        set((state) => ({
          loginFormData: {
            ...state.loginFormData,
            [name]: value,
          },
        }));
      },

      // ---- OTP ----
      OtpFormData: { otp: "" },
      OtpOnChange: (name, value) => {
        set((state) => ({
          OtpFormData: {
            ...state.OtpFormData,
            [name]: value,
          },
        }));
      },

      // ---- State ----
      isFormSubmit: false,

      // ---- API Calls ----
      UserLoginRequest: async (email, password) => {
        try {
          const res = await api.post("/auth/signin", {
            email,
            password,
          });
          console.log(res.data.data,'108')
          Cookies.set("token", res.data.token);
          set({ user: res.data.data._id });
          set({ isLoggedIn: true });
          set({
            userInfo: {
              _id: res.data.data._id,
              email: res.data.data.email,
              image: res.data.data?.image,
              firstName: res.data.data?.firstName,
              lastName: res.data.data?.lastName,
            },
          });
          return {
            status: "success",
            message: res.data.message,
            token: res.data.token,
          };
        } catch (error: unknown) {
          const err = error as AxiosError<{ message?: string }>;
          console.log(err);
          return {
            status: "error",
            message: err.response?.data?.message || err.message,
          };
        }
      },

      UserSignupRequest: async (email, password, firstName, lastName) => {
        try {
          const res = await api.post("/auth/signup", {
            email,
            password,
            firstName,
            lastName,
          });

          return res.data;
        } catch (error: unknown) {
          console.log(error);

          const err = error as AxiosError<{ message: string }>;

          return {
            status: "error",
            message: err.response?.data?.message || err.message,
          };
        }
      },

      UserForgetPasswordRequest: async (email) => {
        try {
          const res = await api.post("/auth/forget-password", { email });
          console.log("eeee");
          setEmail(email);
          return res.data;
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;

          return {
            status: "error",
            message: err.response?.data?.message || err.message,
          };
        }
      },

      VerifyOtpRequest: async (otp) => {
        const email = getEmail();
        console.log(email);
        const res = await api.post("/auth/verifyOtp", { email, otp });
        console.log("line173");

        if (res.data.status === "success") {
          console.log("dkd");
          return { status: "success", message: res.data.message };
        } else {
          console.log(res);
          return { status: "error", message: res.data.message };
        }
      },
      UserNewPassword: async (password, confirmPassword) => {
        const email = getEmail();
        const res = await api.post("/auth/reset-password", {
          email,
          password,
          confirmPassword,
        });
        console.log(res);
        if (res.data.success === true) {
          console.log("dkd");
          return { status: "success", message: res.data.message };
        } else {
          console.log(res);
          return { status: "error", message: res.data.message };
        }
      },

     UserLogoutRequest: async () => {
  console.log("logout");
  
  try {
    const res = await api.post("/auth/signout");
    
    // Clear all cookies
    Cookies.remove("token");
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    // Clear web storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear Zustand state
    set({ user: "", isLoggedIn: false, userInfo: null });
    
    // Clear persisted store
    localStorage.removeItem("user-store");
    
    return res.data["status"];
    
  } catch (error) {
    // Clear storage even on error
    Cookies.remove("token");
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    localStorage.clear();
    sessionStorage.clear();
    set({ user: "", isLoggedIn: false, userInfo: null });
    localStorage.removeItem("user-store");
    
    throw error;
  }
},
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        loginFormData: state.loginFormData,
        userInfo: state.userInfo,
      }),
    }
  )
);

export default useUserStore;
