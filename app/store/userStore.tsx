import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { getEmail, setEmail, unauthorized } from "../utility/utility";



interface UserStoreState {
  isLoggedIn: boolean;
  user: string;
  isLogin: () => boolean;

  

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

          Cookies.set("token", res.data.token);
          set({ user: res.data.data._id });
          set({ isLoggedIn: true });

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
        console.log("logiout");
        console.log(Cookies.get('token'),"kdkd")
        const res = await api.post("/auth/signout");
        
        Cookies.remove("token");
        set({ user: "" });
        set({ isLoggedIn: false });

        return res.data["status"];
      },
    }),
    {
      name: "user-store",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        loginFormData: state.loginFormData,
      }),
    }
  )
);

export default useUserStore;
