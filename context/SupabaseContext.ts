import { createContext, Dispatch, SetStateAction } from "react";

interface SupabaseContextType {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  register: () => Promise<void>;
  forgotPassword: () => Promise<void>;
  logout: () => Promise<void>;
  getGoogleOAuthUrl: () => Promise<string>;
  setOAuthSession: () => Promise<void>;
  setCallGroup: React.Dispatch<React.SetStateAction<any>>;
  callGroup: Record<string, unknown>;
}

export const SupabaseContext = createContext<SupabaseContextType>({
  isLoggedIn: false,
  login: async () => {},
  register: async () => {},
  forgotPassword: async () => {},
  logout: async () => {},
  getGoogleOAuthUrl: async () => "",
  setOAuthSession: async () => {},
  setCallGroup: () => {},
  callGroup: {},
});
