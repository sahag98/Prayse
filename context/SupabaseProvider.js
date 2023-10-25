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
  const [newPost, setNewPost] = useState(false);
  const [newAnswer, setNewAnswer] = useState(false);
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
        redirectTo: "prayseapp://google-auth",
        // prayseapp://google-auth
        // exp://192.168.1.110:19000
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
    console.log("in auth session: ", data.session.user.id);
    setLoggedIn(data.session !== null);

    let { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.session.user.id);

    setCurrentUser(profiles[0]);
    setLoggedIn(true);
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    await checkIfUserIsLoggedIn();
    if (error) throw error;
    setLoggedIn(true);
  };

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    console.log("in register: ", data);
    if (error) throw error;
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.prayse.app/password",
    });
    console.log("password reset link sent");
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
    console.log("checking :", result);
    setSession(result.data.session);
    setLoggedIn(result.data.session !== null);
    if (result.data.session) {
      let { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", result.data.session.user.id);

      if (profileError) {
        console.log(profileError);
      }
      setCurrentUser(profiles[0]);

      return profiles;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const profiles = await checkIfUserIsLoggedIn();
      console.log("profiles: ", profiles[0]);
      // Check if user is logged in before setting up subscriptions
      if (profiles[0] && profiles.length > 0) {
        const prayersChannel = supabase
          .channel("table_db_changes")
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "prayers",
            },
            (payload) => {
              console.log(
                "prayer user: ",
                profiles[0].id + "payload: ",
                payload.new.user_id
              );
              if (
                payload.eventType === "INSERT" &&
                profiles[0].id !== payload.new.user_id
              ) {
                setNewPost(true);
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "answers",
            },
            (payload) => {
              console.log(
                "prayer user: ",
                profiles[0].id + "payload: ",
                payload.new.user_id
              );
              if (
                payload.eventType === "INSERT" &&
                profiles[0].id !== payload.new.user_id
              ) {
                setNewAnswer(true);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(prayersChannel);
        };
      }
    };

    fetchData();
  }, []);

  return (
    <SupabaseContext.Provider
      value={{
        newPost,
        setNewPost,
        newAnswer,
        setNewAnswer,
        isLoggedIn,
        login,
        supabase,
        session,
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
