import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";

import { createClient } from "@supabase/supabase-js";

import config from "../config";

import { SupabaseContext } from "./SupabaseContext";

import "react-native-url-polyfill/auto";
import { useRouter } from "expo-router";

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
  const router = useRouter();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [newPost, setNewPost] = useState(false);
  const [newAnswer, setNewAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [publicGroups, setPublicGroups] = useState([]);
  const [refreshLikes, setRefreshLikes] = useState(false);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [refreshMembers, setRefreshMembers] = useState(false);
  const [refreshMsgLikes, setRefreshMsgLikes] = useState(false);
  const [newGroupMsgNum, setNewGroupMsgNum] = useState(0);
  const [newMsgGroupId, setNewMsgGroupId] = useState(0);
  const [userofSentMessage, setUserofSentMessage] = useState("");
  const [refreshComments, setRefreshComments] = useState(false);
  const [refreshGroup, setRefreshGroup] = useState(false);
  const [refreshAnswers, setRefreshAnswers] = useState(false);
  const [refreshReflections, setRefreshReflections] = useState(false);
  const [latestQuestion, setLatestQuestion] = useState(null);
  const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
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
    setLoggedIn(data.session !== null);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.session.user.id);

    setCurrentUser(profiles[0]);
    setLoggedIn(true);
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const profiles = await checkIfUserIsLoggedIn();

    if (profiles[0] && profiles[0].full_name !== null) {
      router.push("/(tabs)/community");
    } else if (profiles[0] && profiles[0].full_name === null) {
      router.push("profile-setup");
    }
    if (error) showToast("error", "Invalid login credentials.");
    if (error) throw error;
    setLoggedIn(true);
  };

  const register = async (email, password) => {
    console.log("trying to register...");
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) showToast("error", "User already registered. Sign in.");
    console.log("Error: ", error);
    if (error) throw error;
  };

  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://www.prayse.app/password",
    });
    if (error) throw error;
  };

  const logout = async () => {
    console.log("logging out");
    setLoggedIn(false);
    setSession(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return error;
  };

  const fetchPublicGroups = async () => {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("is_public", true);
    setPublicGroups(data);
  };

  const fetchQuestions = async () => {
    const { data: allQuestions } = await supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: false });
    setQuestions(allQuestions);
  };

  const fetchLatestQuestion = async () => {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("id", { ascending: false });

    setLatestQuestion(data[0]);
  };

  async function fetchUpdatedAnswers(id) {
    const { data: answers, error: answersError } = await supabase
      .from("answers")
      .select("*, profiles(avatar_url,full_name)")
      .eq("question_id", id)
      .order("id", { ascending: false });

    const copyofQuestions = [...questions];
    const foundQuestion = copyofQuestions.find((q) => q.id === id);

    foundQuestion.answers = answers;
    setQuestions(copyofQuestions);
    setNewAnswer(false);
    if (answersError) {
      console.log(answersError);
    }
  }

  async function fetchAnswers() {
    const { data: answers, error: answersError } = await supabase
      .from("answers")
      .select("*, profiles(avatar_url,full_name)")
      .order("id", { ascending: false });

    if (answersError) {
      console.log(answersError);
    }

    setAnswers(answers);
  }

  const checkIfUserIsLoggedIn = async () => {
    console.log("CHECKING USER");
    const result = await supabase.auth.getSession();
    setSession(result.data.session ? result.data.session : null);
    setLoggedIn(result.data.session !== null);
    if (result.data.session) {
      console.log("session is on");
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", result.data.session.user.id);

      console.log("profiles 0: ", profiles[0]);
      setCurrentUser(profiles[0]);

      if (profileError) {
        console.log(profileError);
      }

      return profiles;
    }
  };

  useEffect(() => {
    fetchQuestions();
    fetchLatestQuestion();
    fetchPublicGroups();
    fetchAnswers();
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

              if (
                payload.eventType === "INSERT" ||
                payload.eventType === "DELETE"
              ) {
                fetchPublicGroups();
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
                payload.eventType === "INSERT" ||
                payload.eventType === "DELETE"
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
              table: "questions",
            },
            (payload) => {
              if (
                payload.eventType === "INSERT" ||
                payload.eventType === "DELETE" ||
                payload.eventType === "UPDATE"
              ) {
                console.log("refresh test questions");
                fetchQuestions();
                fetchAnswers();
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
              console.log("payload: ", payload.new.question_id);
              if (
                payload.eventType === "INSERT" ||
                payload.eventType === "DELETE"
              ) {
                console.log("refreshing answers");
                setRefreshAnswers(true);
                fetchAnswers();
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
        publicGroups,
        fetchLatestQuestion,
        fetchQuestions,
        fetchAnswers,
        latestQuestion,
        setRefreshAnswers,
        refreshAnswers,
        fetchUpdatedAnswers,
        getGoogleOAuthUrl,
        setOAuthSession,
        questions,
        setQuestions,
        answers,
        setAnswers,
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
