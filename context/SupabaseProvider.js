import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { SupabaseContext } from "./SupabaseContext";
import Toast from "react-native-toast-message";
import { SUPABASE_URL, SUPABASE_ANON } from "@env";
// We are using Expo Secure Store to persist session info
const ExpoSecureStoreAdapter = {
  getItem: async (key) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key, value) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key) => {
    await SecureStore.deleteItemAsync(key);
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
  const [refreshLikes, setRefreshLikes] = useState(false);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [refreshMembers, setRefreshMembers] = useState(false);
  const [refreshMsgLikes, setRefreshMsgLikes] = useState(false);
  const [newGroupMsgNum, setNewGroupMsgNum] = useState(0);
  const [newMsgGroupId, setNewMsgGroupId] = useState(0);
  const [userofSentMessage, setUserofSentMessage] = useState("");
  const [refreshComments, setRefreshComments] = useState(false);
  const [refreshGroup, setRefreshGroup] = useState(false);

  const [refreshReflections, setRefreshReflections] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  // const getGoogleOAuthUrl = async () => {
  //   const result = await supabase.auth.signInWithOAuth({
  //     provider: "google",
  //     options: {
  //       redirectTo: "prayseapp://google-auth",
  //       // prayseapp://google-auth
  //       // exp://192.168.1.110:19000
  //     },
  //   });

  //   return result.data.url;
  // };

  // const setOAuthSession = async (tokens) => {
  //   const { data, error } = await supabase.auth.setSession({
  //     access_token: tokens.access_token,
  //     refresh_token: tokens.refresh_token,
  //   });

  //   if (error) throw error;
  //   console.log("in auth session: ", data.session.user.id);
  //   setLoggedIn(data.session !== null);

  //   let { data: profiles, error: profileError } = await supabase
  //     .from("profiles")
  //     .select("*")
  //     .eq("id", data.session.user.id);

  //   setCurrentUser(profiles[0]);
  //   setLoggedIn(true);
  // };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    await checkIfUserIsLoggedIn();
    if (error) showToast("error", "Invalid login credentials.");
    if (error) throw error;
    setLoggedIn(true);
  };

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) showToast("error", "User already registered. Sign in.");
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
    console.log("logging out");
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setLoggedIn(false);
    setSession(null);
  };

  const checkIfUserIsLoggedIn = async () => {
    console.log("checking user");
    const result = await supabase.auth.getSession();
    setSession(result.data.session ? result.data.session : null);
    setLoggedIn(result.data.session !== null);
    if (result.data.session) {
      console.log("session is on");
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

      // Check if user is logged in before setting up subscriptions
      if (profiles[0] && profiles.length > 0) {
        //prayers for production
        //prayers_test for testing
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
              if (
                payload.eventType === "INSERT" &&
                profiles[0].id !== payload.new.user_id
              ) {
                setNewAnswer(true);
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "groups",
            },
            (payload) => {
              if (payload.eventType === "DELETE") {
                console.log(payload);
                setRefreshGroup(true);
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "messages",
            },
            (payload) => {
              setIsNewMessage(true);
              setNewGroupMsgNum((prevState) => prevState + 1);
              setNewMsgGroupId(payload.new.group_id);

              setUserofSentMessage(payload.new.user_id);
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "members",
            },
            (payload) => {
              if (
                payload.eventType == "INSERT" ||
                payload.eventType == "DELETE"
              ) {
                setRefreshMembers(true);
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "message_likes",
            },
            (payload) => {
              if (
                payload.eventType == "INSERT" ||
                payload.eventType == "DELETE"
              ) {
                console.log("refresh payload");
                setRefreshMsgLikes(true);
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "likes",
            },
            (payload) => {
              if (
                payload.eventType === "INSERT" ||
                payload.eventType === "DELETE"
              ) {
                setRefreshLikes(true);
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "comments",
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setRefreshComments(true);
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "reflections",
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                console.log(payload);
                setRefreshReflections(true);
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
        isNewMessage,
        setRefreshMsgLikes,
        refreshMsgLikes,
        setRefreshReflections,
        refreshReflections,
        setRefreshGroup,
        refreshGroup,
        setIsNewMessage,
        refreshMembers,
        setRefreshMembers,
        isLoggedIn,
        newGroupMsgNum,
        setNewGroupMsgNum,
        login,
        userofSentMessage,
        setUserofSentMessage,
        supabase,
        session,
        currentUser,
        newMsgGroupId,
        checkIfUserIsLoggedIn,
        setNewMsgGroupId,
        setCurrentUser,
        register,
        setLoggedIn,
        refreshComments,
        setRefreshComments,
        refreshLikes,
        setRefreshLikes,
        forgotPassword,
        logout,
      }}
    >
      {props.children}
    </SupabaseContext.Provider>
  );
};
