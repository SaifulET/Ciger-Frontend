import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import {AxiosError} from "axios";
import api from "@/lib/axios";
import Cookies from "js-cookie"
import { getEmail, setEmail, unauthorized } from "../utility/utility";

// --------------------
// Types
// --------------------

interface Profile {
  cus_add: string;
  cus_city: string;
  cus_country: string;
  cus_fax: string;
  cus_name: string;
  cus_phone: string;
  cus_postcode: string;
  cus_state: string;
  ship_name: string;
  ship_phone: string;
  ship_country: string;
  ship_city: string;
  ship_state: string;
  ship_postcode: string;
  ship_add: string;
}

interface UserStoreState {
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
  ) => Promise<{ status: "success" | "error"; message?: string; token?: string }>;
  UserSignupRequest: (
  email: string,
  password: string,
  firstName: string,
  lastName: string
) => Promise<{ status: "success" | "error"; message?: string }>;

UserForgetPasswordRequest: (
    email: string,
  ) => Promise<{ status: "success" | "error"; message?: string; token?: string }>;

  VerifyOtpRequest: (otp: string) => Promise<{ status: "success" | "error"; message?: string }>;
  UserLogoutRequest: () => Promise<string>;

  // Profile
  ProfileForm: Profile;
  ProfileFormChange: (name: string, value: string) => void;

  ProfileDetails: Profile | null;
  ProfileDetailsRequest: () => Promise<void>;
  ProfileSaveRequest: (PostBody: Profile) => Promise<boolean>;
}




// --------------------
// Persisted Zustand store
// --------------------

const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      // ---- Auth ----
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
console.log("hellow")
      Cookies.set("token", res.data.token);

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


       UserSignupRequest:async(email,password,firstName,lastName)=>{
        try {
          const res= await api.post("/auth/signup",{ email, password,firstName,lastName })
          console.log(res)
          return res.data
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;

          return {
            status: "error",
            message: err.response?.data?.message || err.message,
          };
          }
      },

       UserForgetPasswordRequest:async(email)=>{
        try {
          const res= await api.post("/auth/forget-password",{ email })
          console.log("eeee")
          setEmail(email);
          return res.data
        } catch (error: unknown) {
          const err = error as AxiosError<{ message: string }>;

          return {
            status: "error",
            message: err.response?.data?.message || err.message,
          };
          }
      },
      

     VerifyOtpRequest: async (otp) => {
  set({ isFormSubmit: true });
  const email = getEmail();
  const res = await api.post("/api/VerifyOtp", { email, otp });

  set({ isFormSubmit: false });

  if (res.data.status === "success") {
    return { status: "success", message: res.data.message };
  } else {
    return { status: "error", message: res.data.message };
  }
}
,
     

      UserLogoutRequest: async () => {
        set({ isFormSubmit: true });
        const res = await axios.get("/api/Logout");
        Cookies.remove("token");
        set({ isFormSubmit: false });
        return res.data["status"];
      },

      // ---- Profile ----
      ProfileForm: {
        cus_add: "",
        cus_city: "",
        cus_country: "",
        cus_fax: "",
        cus_name: "",
        cus_phone: "",
        cus_postcode: "",
        cus_state: "",
        ship_name: "",
        ship_phone: "",
        ship_country: "",
        ship_city: "",
        ship_state: "",
        ship_postcode: "",
        ship_add: "",
      },

      ProfileFormChange: (name, value) => {
        set((state) => ({
          ProfileForm: {
            ...state.ProfileForm,
            [name]: value,
          },
        }));
      },

      ProfileDetails: null,

      ProfileDetailsRequest: async () => {
        try {
          const res = await axios.get("/api/ReadUserProfile", {
            withCredentials: true,
          });

          if (res.data?.Message?.data) {
            set({
              ProfileDetails: res.data.Message.data,
              ProfileForm: res.data.Message.data,
            });
          } else {
            set({ ProfileDetails: null });
          }
        } catch (e) {
          console.error(e);
        }
      },

      ProfileSaveRequest: async (PostBody) => {
        try {
          set({ ProfileDetails: null });
          const res = await axios.post("/api/UpdateUserProfile", PostBody, {
            withCredentials: true,
          });
          return res.data["status"] === "success";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          if (e.response?.status) {
            unauthorized(e.response.status);
          }
          return false;
        }
      },
    }),
    {
      name: "user-store", // key in localStorage
      partialize: (state) => ({
        // persist only what you need
        loginFormData: state.loginFormData,
        ProfileDetails: state.ProfileDetails,
        ProfileForm: state.ProfileForm,
      }),
    }
  )
);

export default useUserStore;
