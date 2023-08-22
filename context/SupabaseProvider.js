import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { SupabaseContext } from "./SupabaseContext";
import { SUPABASE_URL, SUPABASE_ANON } from "@env";
// We are using Expo Secure Store to persist session info
const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const SupabaseProvider = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [prayers, setPrayers] = useState(null);
  const [session, setSession] = useState(null);
  const [isNavigationReady, setNavigationReady] = useState(false);

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  const getGoogleOAuthUrl = async () => {
    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "exp://192.168.1.110:19000",
      },
    });

    return result.data.url;
  };

  const setOAuthSession = async (tokens) => {
    const { data, error } = await supabase.auth.setSession({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });

    if (error) throw error;

    setLoggedIn(data.session !== null);

    let { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.session.user.id);

    setCurrentUser(profiles[0]);
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setLoggedIn(true);
  };

  const register = async (email, password) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setLoggedIn(false);
    setSession(null);
  };

  const checkIfUserIsLoggedIn = async () => {
    const result = await supabase.auth.getSession();
    setSession(result.data.session);
    setLoggedIn(result.data.session !== null);
    if (result.data.session) {
      let { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", result.data.session.user.id);
      setCurrentUser(profiles[0]);
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel("table_db_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          const newRecord = payload.new;
          console.log("new :", newRecord);
          setCurrentUser(newRecord);
        }
      )
      .subscribe();

    // const prayerChannel = supabase
    //   .channel("table_db_changes")
    //   .on(
    //     "postgres_changes",
    //     {
    //       event: "*",
    //       schema: "public",
    //       table: "prayers",
    //     },
    //     (payload) => {
    //       console.log("new :", payload);
    //     }
    //   )
    //   .subscribe();

    return () => {
      supabase.removeChannel(channel);
      // supabase.removeChannel(prayerChannel);
    };
  }, []);

  useEffect(() => {
    checkIfUserIsLoggedIn();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        isLoggedIn,
        login,
        supabase,
        currentUser,
        setCurrentUser,
        register,
        setLoggedIn,
        getGoogleOAuthUrl,
        setOAuthSession,
        forgotPassword,
        logout,
      }}
    >
      {props.children}
    </SupabaseContext.Provider>
  );
};
