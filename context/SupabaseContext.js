import { createContext } from "react";

export const SupabaseContext = createContext({
  isLoggedIn: false,
  login: async () => {},
  register: async () => {},
  forgotPassword: async () => {},
  logout: async () => {},
  getGoogleOAuthUrl: async () => "",
  setOAuthSession: async () => {},
});
