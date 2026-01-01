import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Linking,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";

import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "../types/reduxTypes";
import { useSupabase } from "../context/useSupabase";
import { PeopleContainer } from "@components/PeopleContainer";
import { ADD_FRIEND_SCREEN, FOLDER_SCREEN, PEOPLE_SCREEN } from "@routes";
import { SetNameModal } from "@modals/set-name-modal";
import { registerForPushNotificationsAsync } from "./(tabs)/folder";
import { Database } from "../database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type FriendRow = Database["public"]["Tables"]["friends"]["Row"];
type FriendInsert = Database["public"]["Tables"]["friends"]["Insert"];
type FriendUpdate = Database["public"]["Tables"]["friends"]["Update"];

interface Friend {
  id: number;
  friend_id: string;
  friend_name: string | null;
  avatar_url: string | null;
  expoToken: string | null;
  prayer_count: number;
  status: string | null;
}

interface PendingRequest {
  id: string;
  name: string | null;
  avatar_url: string | null;
  expoToken: string | null;
}

interface SupabaseContext {
  register: () => Promise<void>;
  login: () => Promise<void>;
  getGoogleOAuthUrl: () => Promise<string>;
  setOAuthSession: (params: {
    access_token: string;
    refresh_token: string;
  }) => Promise<void>;
  supabase: ReturnType<
    typeof import("@supabase/supabase-js").createClient<Database>
  >;
  currentUser: Profile | null;
  isLoggedIn: boolean;
  getUser: (user: { id: string }) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentUser: (user: Profile | null) => void;
}

const PeopleScreen = () => {
  const [forgotModal, setForgotModal] = useState(false);
  const [showFriendCodeModal, setShowFriendCodeModal] = useState(false);
  const [friendCode, setFriendCode] = useState("");
  const friendSheetRef = useRef<BottomSheetModal>(null);
  const friendSnapPoints = useMemo(() => ["25%", "50%"], []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    register,
    login,
    getGoogleOAuthUrl,
    setOAuthSession,
    supabase,
    currentUser,
    isLoggedIn,
    getUser,
    logout,
    setCurrentUser,
  } = useSupabase() as unknown as SupabaseContext;

  const [passVisible, setPassVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [friends, setFriends] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [showSetNameModal, setShowSetNameModal] = useState(false);
  const hasCheckedName = useRef(false);
  const router = useRouter();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme
  );
  const { colorScheme } = useColorScheme();
  const queryClient = useQueryClient();

  const { data: friendList } = useQuery({
    queryKey: ["friends", currentUser?.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("No current user");
      // Fetch current user's friend relationships

      const { data: relations, error: relError } = await supabase
        .from("friends")
        .select(
          "*, user:profiles!friends_user_id_fkey(*),friend:profiles!friends_friend_id_fkey(*)"
        )
        .eq("user_id", currentUser.id);

      // .eq("status", "confirmed");

      if (relError) throw relError;

      const friendIds = (relations || []).map(
        (r: { friend_id: string }) => r.friend_id
      );

      // if (friendIds.length === 0) return [] as any[];

      // // Fetch profiles for those friend ids
      // const { data: profiles, error: profError } = await supabase
      //   .from("profiles")
      //   .select("*")
      //   .in("id", friendIds);

      // if (profError) throw profError;

      // Normalize for UI consumption
      return (relations || []).map((p: FriendRow & { friend: Profile }) => ({
        id: p.id,
        friend_id: p.friend.id,
        friend_name: p.friend.full_name,
        avatar_url: p.friend.avatar_url,
        expoToken: p.friend.expoToken,
        prayer_count: p.prayer_count ?? 0,
        status: p.status,
      }));
    },
    staleTime: 30_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Incoming pending requests (people who added me)
  const { data: pendingRequests } = useQuery({
    queryKey: ["pending-requests", currentUser?.id],
    enabled: !!currentUser?.id,
    queryFn: async () => {
      if (!currentUser?.id) throw new Error("No current user");
      // Find requests where I am the target and status is pending
      const { data: relations, error: relError } = await supabase
        .from("friends")
        .select("user_id")
        .eq("friend_id", currentUser.id)
        .eq("status", "pending");

      if (relError) throw relError;

      const requesterIds = (relations || []).map(
        (r: { user_id: string }) => r.user_id
      );
      if (requesterIds.length === 0) return [] as PendingRequest[];

      const { data: profiles, error: profError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, expoToken")
        .in("id", requesterIds);

      if (profError) throw profError;

      return (profiles || []).map((p) => ({
        id: p.id,
        name: p.full_name,
        avatar_url: p.avatar_url,
        expoToken: p.expoToken,
      }));
    },
    staleTime: 10_000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!currentUser?.id) return;
    async function getNotificationToken() {
      if (!currentUser) return;
      if (currentUser.expoToken !== null) return;
      const token = await registerForPushNotificationsAsync();
      if (token && currentUser.expoToken === null) {
        console.log("token", token);
        await supabase
          .from("profiles")
          .update({ expoToken: token })
          .eq("id", currentUser.id);
      }
    }
    getNotificationToken();
    const channel = supabase
      .channel(`friends_changes_people_${currentUser.id}`)
      .on(
        "postgres_changes" as any,
        {
          event: "*",
          schema: "public",
          table: "friends",
        } as any,
        (payload: { eventType: string; new?: FriendRow; old?: FriendRow }) => {
          const { eventType, new: newRecord, old: oldRecord } = payload || {};

          if (eventType === "UPDATE" && newRecord?.user_id === currentUser.id) {
            queryClient.setQueryData(
              ["friends", currentUser.id],
              (oldData: unknown) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.map((friend: Friend) =>
                  friend.id === newRecord.id
                    ? { ...friend, status: newRecord.status ?? friend.status }
                    : friend
                );
              }
            );
          }

          if (eventType === "DELETE" && oldRecord?.user_id === currentUser.id) {
            queryClient.setQueryData(
              ["friends", currentUser.id],
              (oldData: unknown) => {
                if (!Array.isArray(oldData)) return oldData;
                return oldData.filter(
                  (friend: Friend) => friend.id !== oldRecord.id
                );
              }
            );
          }

          queryClient.invalidateQueries({
            queryKey: ["friends", currentUser.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["pending-requests", currentUser.id],
          });
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {}
    };
  }, [currentUser?.id]);

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      if (!state.isConnected) {
        showToast(
          "error",
          "No internet connection. Please check your network."
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Check if user needs to set their name when they sign in
  useEffect(() => {
    console.log("here");
    if (currentUser) {
      console.log("currentUser", currentUser);
      // Check if full_name is empty, null, or undefined
      const needsName =
        !currentUser.full_name || currentUser.full_name.trim().length === 0;
      if (needsName && !hasCheckedName.current) {
        setShowSetNameModal(true);
        hasCheckedName.current = true;
      } else if (!needsName) {
        // Reset the check flag if user has a name
        hasCheckedName.current = false;
      }
    } else {
      // Reset when user logs out
      hasCheckedName.current = false;
    }
  }, [currentUser, isLoggedIn]);

  const showToast = (type: string, content: string) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 5000,
    });
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error: any) {
      console.error("Sign out error:", error);
      showToast("error", "Failed to sign out. Please try again.");
    }
  };

  const handleNameSet = async () => {
    // Refresh the current user data after name is set
    if (currentUser?.id) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (profiles) {
        setCurrentUser(profiles);
        // Reset the check flag so we don't show the modal again
        hasCheckedName.current = false;
      }
    }
  };

  // Retry mechanism with exponential backoff and network check
  const retryWithBackoff = async (
    fn: () => Promise<any>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ) => {
    // Check network connectivity first
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error("No internet connection");
    }

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        const isLastAttempt = attempt === maxRetries - 1;
        const isNetworkError =
          error.message?.includes("Network request failed") ||
          error.message?.includes("fetch") ||
          error.message?.includes("No internet connection") ||
          error.code === "NETWORK_ERROR" ||
          error.name === "AuthRetryableFetchError";

        if (isLastAttempt || !isNetworkError) {
          throw error;
        }

        // Check network again before retrying
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          throw new Error("No internet connection");
        }

        const delay = baseDelay * Math.pow(2, attempt);
        console.log(
          `Network request failed, retrying in ${delay}ms (attempt ${
            attempt + 1
          }/${maxRetries})`
        );
        showToast("info", `Retrying... (${attempt + 1}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const SignUp = () => {
    if (email.length === 0 || password.length === 0) {
      showToast("error", "Email and password fields can't be empty.");
    } else {
      register();
      setIsLoggingIn(true);
    }
  };

  const resetAccount = () => {
    setForgotModal(false);
    Linking.openURL("mailto:arzsahag@gmail.com");
  };

  const onSignInWithGoogle = async () => {
    try {
      const url = await retryWithBackoff(async () => {
        return await getGoogleOAuthUrl();
      });

      if (!url) {
        showToast("error", "Failed to get Google sign-in URL");
        return;
      }
      console.log("url: ", url);

      const result = await WebBrowser.openAuthSessionAsync(
        url,
        "prayseapp://google-auth",
        {
          showInRecents: true,
        }
      );

      if (result.type === "success") {
        const data = extractParamsFromUrl(result.url);

        if (!data.access_token || !data.refresh_token) {
          showToast("error", "Failed to get authentication tokens");
          return;
        }

        await retryWithBackoff(async () => {
          if (!data.access_token || !data.refresh_token) {
            throw new Error("Missing tokens");
          }
          return await setOAuthSession({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
        });
        // router.push(FOLDER_SCREEN);
      }
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("Network request failed")) {
        showToast(
          "error",
          "Network error. Please check your connection and try again."
        );
      } else {
        showToast("error", "An error occurred during Google sign-in");
      }
    }
  };

  const extractParamsFromUrl = (
    url: string
  ): {
    access_token: string | null;
    expires_in: number;
    refresh_token: string | null;
    token_type: string | null;
    provider_token: string | null;
  } => {
    const params = new URLSearchParams(url.split("#")[1]);
    const data = {
      access_token: params.get("access_token"),
      expires_in: parseInt(params.get("expires_in") || "0", 10),
      refresh_token: params.get("refresh_token"),
      token_type: params.get("token_type"),
      provider_token: params.get("provider_token"),
    };

    return data;
  };

  const incrementPrayer = useMutation({
    mutationFn: async (friend: Friend) => {
      if (!currentUser?.id) throw new Error("No current user");
      // Fetch current count and token
      const { data: friendData, error: fetchErr } = await supabase
        .from("friends")
        .select(
          "prayer_count, user:profiles!friends_user_id_fkey(*),friend:profiles!friends_friend_id_fkey(*)"
        )
        .eq("user_id", currentUser.id)
        .eq("friend_id", friend.friend_id)
        .single();

      console.log("fetchErr", fetchErr);
      if (fetchErr) throw fetchErr;

      const nextCount = (friendData?.prayer_count ?? 0) + 1;
      const { error: updateErr } = await supabase
        .from("friends")
        .update({ prayer_count: nextCount })
        .eq("user_id", currentUser.id)
        .eq("friend_id", friend.friend_id);
      if (updateErr) throw updateErr;

      console.log(JSON.stringify(friendData, null, 2));

      if (friendData.friend?.expoToken) {
        console.log("hereee");
        const message = {
          to: friendData.friend?.expoToken,
          sound: "default",
          title: `${friendData?.user.full_name}`,
          body: "is praying for you ❤️",
          data: { screen: PEOPLE_SCREEN },
        };
        try {
          await axios.post("https://exp.host/--/api/v2/push/send", message, {
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
          });
        } catch (e) {
          console.log("push send error", e);
        }
      }

      return nextCount;
    },
    onSuccess: () => {
      if (currentUser?.id) {
        queryClient.invalidateQueries({
          queryKey: ["friends", currentUser.id],
        });
      }
    },
    onError: (e: unknown) => {
      console.error(e);
      Toast.show({ type: "error", text1: "Failed to register prayer" });
    },
  });

  // Accept a pending request
  const acceptRequest = useMutation({
    mutationFn: async (requester: PendingRequest) => {
      if (!currentUser?.id) throw new Error("No current user");
      // Confirm the incoming row (requester -> me)
      const { error: updateErr } = await supabase
        .from("friends")
        .update({ status: "confirmed" } satisfies FriendUpdate)
        .eq("user_id", requester.id)
        .eq("friend_id", currentUser.id);
      if (updateErr) throw updateErr;

      // Ensure reciprocal row (me -> requester) exists and is confirmed
      const { data: existing, error: fetchErr } = await supabase
        .from("friends")
        .select("user_id, friend_id")
        .eq("user_id", currentUser.id)
        .eq("friend_id", requester.id)
        .maybeSingle();
      if (fetchErr) throw fetchErr;

      if (!existing) {
        const { error: insertErr } = await supabase.from("friends").insert({
          user_id: currentUser.id,
          friend_id: requester.id,
          status: "confirmed",
        } satisfies FriendInsert);
        if (insertErr) throw insertErr;
      } else {
        const { error: confirmErr } = await supabase
          .from("friends")
          .update({ status: "confirmed" } satisfies FriendUpdate)
          .eq("user_id", currentUser.id)
          .eq("friend_id", requester.id);
        if (confirmErr) throw confirmErr;
      }
    },
    onSuccess: () => {
      if (currentUser?.id) {
        queryClient.invalidateQueries({
          queryKey: ["friends", currentUser.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["pending-requests", currentUser.id],
        });
        Toast.show({ type: "success", text1: "Friend request accepted" });
      }
    },
    onError: (e: unknown) => {
      console.error(e);
      Toast.show({ type: "error", text1: "Failed to accept request" });
    },
  });

  // Decline a pending request (remove both sides)
  const declineRequest = useMutation({
    mutationFn: async (requester: PendingRequest) => {
      if (!currentUser?.id) throw new Error("No current user");
      // Delete requester -> me
      const { error: delErr1 } = await supabase
        .from("friends")
        .delete()
        .eq("user_id", requester.id)
        .eq("friend_id", currentUser.id);
      if (delErr1) throw delErr1;

      // Delete me -> requester if exists
      const { error: delErr2 } = await supabase
        .from("friends")
        .delete()
        .eq("user_id", currentUser.id)
        .eq("friend_id", requester.id);
      if (delErr2) throw delErr2;
    },
    onSuccess: () => {
      if (currentUser?.id) {
        queryClient.invalidateQueries({
          queryKey: ["friends", currentUser.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["pending-requests", currentUser.id],
        });
      }
    },
    onError: (e: unknown) => {
      console.error(e);
    },
  });

  const renderFriendItem = ({ item }: { item: Friend }) => {
    return (
      <View className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-xl mb-3">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-light-primary dark:bg-dark-accent rounded-full items-center justify-center">
            <Text className="text-white dark:text-dark-background font-inter-bold text-lg">
              {item.friend_name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-inter-bold text-lg text-light-primary dark:text-dark-primary">
              {item.friend_name || "Unknown"}
            </Text>
          </View>
          {item.status === "confirmed" ? (
            <TouchableOpacity
              className="p-3 flex-row border border-light-primary/25 bg-[#b7d3ff] dark:bg-[#353535]  dark:border-dark-primary/25 justify-center rounded-xl items-center"
              onPress={() => incrementPrayer.mutate(item)}
            >
              <MaterialCommunityIcons
                name="hands-pray"
                size={22}
                color={
                  actualTheme && actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
                }
              />
              <Text
                className="ml-1 font-inter-semibold"
                style={{
                  color:
                    actualTheme && actualTheme.PrimaryTxt
                      ? actualTheme.PrimaryTxt
                      : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51",
                }}
              >
                {item.prayer_count ?? 0}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="p-3 flex-row border border-light-primary/25 bg-[#b7d3ff]  dark:border-dark-primary justify-center rounded-xl items-center">
              <Text className="font-inter-semibold">Pending</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center">
      <MaterialCommunityIcons
        name="account-group-outline"
        size={80}
        color={
          actualTheme && actualTheme.PrimaryTxt
            ? actualTheme.PrimaryTxt
            : colorScheme === "dark"
            ? "white"
            : "#2f2d51"
        }
      />
      <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary text-center mt-4">
        Your prayer community starts here
      </Text>
      <Text className="font-inter-medium text-light-primary dark:text-dark-primary text-center mt-2">
        Add people to your prayer list and let them know you're praying for
        them.
      </Text>
      <TouchableOpacity
        onPress={() => router.push(ADD_FRIEND_SCREEN)}
        style={getPrimaryBackgroundColorStyle(actualTheme)}
        className="bg-light-primary dark:bg-dark-accent p-4 rounded-lg mt-6 w-full"
      >
        <Text
          style={getPrimaryTextColorStyle(actualTheme)}
          className="font-inter-bold text-light-background text-lg dark:text-dark-background text-center"
        >
          Add People
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignInSection = () => (
    <View className="flex-1 justify-center items-center">
      <MaterialCommunityIcons
        name="account-group"
        size={80}
        color={
          actualTheme && actualTheme.PrimaryTxt
            ? actualTheme.PrimaryTxt
            : colorScheme === "dark"
            ? "white"
            : "#2f2d51"
        }
      />
      <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary text-center mt-4">
        Your prayers matter ❤️
      </Text>
      <Text className="font-inter-medium text-light-primary dark:text-dark-primary text-center mt-2">
        Let your friends feel the love and support of your prayers.
      </Text>

      <View className="w-full mt-8">
        {isLoggingIn && (
          <>
            <TouchableOpacity
              onPress={() => {
                if (isConnected) {
                  onSignInWithGoogle();
                } else {
                  showToast(
                    "error",
                    "No internet connection. Please check your network."
                  );
                }
              }}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className={`bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg justify-center items-center w-full flex-row gap-1.5 ${
                !isConnected ? "opacity-50" : ""
              }`}
              disabled={!isConnected}
            >
              <AntDesign
                name="google"
                size={20}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
                }
              />
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-light-primary text-lg dark:text-dark-primary"
              >
                Sign in with Google
              </Text>
            </TouchableOpacity>
            {Platform.OS === "ios" && (
              <TouchableOpacity
                onPress={async () => {
                  if (!isConnected) {
                    showToast(
                      "error",
                      "No internet connection. Please check your network."
                    );
                    return;
                  }

                  console.log("apple sign in");
                  try {
                    const credential = await AppleAuthentication.signInAsync({
                      requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                      ],
                    });

                    if (credential.identityToken) {
                      const { error, data } = await retryWithBackoff(
                        async () => {
                          if (!credential.identityToken) {
                            throw new Error("No identity token");
                          }
                          return await supabase.auth.signInWithIdToken({
                            provider: "apple",
                            token: credential.identityToken,
                          });
                        }
                      );

                      if (data?.user) {
                        getUser(data.user);
                      }

                      if (error) {
                        showToast("error", "Failed to sign in with Apple");
                      }
                    } else {
                      throw new Error("No identityToken.");
                    }
                  } catch (e: unknown) {
                    const err = e as { code?: string; message?: string };
                    if (err.code === "ERR_REQUEST_CANCELED") {
                      console.log("User canceled Apple sign in");
                    } else if (
                      err.message?.includes("Network request failed")
                    ) {
                      showToast(
                        "error",
                        "Network error. Please check your connection and try again."
                      );
                    } else {
                      console.error("Apple sign in error:", e);
                      showToast("error", "Apple sign in failed");
                    }
                  }
                }}
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className={`bg-light-secondary dark:bg-dark-secondary p-4 mt-3 rounded-lg justify-center items-center w-full flex-row gap-1.5 ${
                  !isConnected ? "opacity-50" : ""
                }`}
                disabled={!isConnected}
              >
                <AntDesign
                  name="apple"
                  size={20}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                  }
                />
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-bold text-light-primary text-lg dark:text-dark-primary"
                >
                  Sign in with Apple
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <PeopleContainer>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View className="flex-1 ">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-bold text-3xl text-light-primary dark:text-dark-primary"
            >
              People
            </Text>
            {!isConnected && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="wifi-outline" size={16} color="#ef4444" />
                <Text className="text-red-500 text-sm font-inter-medium ml-1">
                  No internet connection
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center gap-3">
            {currentUser && friendList && friendList.length > 0 && (
              <TouchableOpacity
                onPress={() => router.push(ADD_FRIEND_SCREEN)}
                className="px-3 py-2 flex-row items bg-light-primary dark:bg-dark-accent rounded-xl items-center gap-2"
              >
                <AntDesign
                  name="plus"
                  size={24}
                  color={
                    actualTheme && actualTheme.PrimaryTxt
                      ? actualTheme.PrimaryTxt
                      : colorScheme === "dark"
                      ? "#121212"
                      : "white"
                  }
                />
                <Text className="font-inter-semibold text-light-background dark:text-dark-background">
                  Add
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <AntDesign
                name="close"
                size={24}
                color={
                  actualTheme && actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {!currentUser ? (
          renderSignInSection()
        ) : (
          <View className="flex-1">
            {/* Pending Requests */}
            {(pendingRequests?.length ?? 0) > 0 && (
              <View className="mb-4">
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-bold text-xl mb-2 text-light-primary dark:text-dark-primary"
                >
                  Requests
                </Text>
                {(pendingRequests || []).map((req: PendingRequest) => (
                  <View
                    key={req.id}
                    className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-xl mb-3"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-12 h-12 bg-light-primary dark:bg-dark-accent rounded-full items-center justify-center">
                        <Text className="text-white font-inter-bold text-lg">
                          {req.name?.charAt(0)?.toUpperCase() || "?"}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-inter-bold text-lg text-light-primary dark:text-dark-primary">
                          {req.name || "Unknown"}
                        </Text>
                        <Text className="font-inter-medium opacity-70 text-light-primary dark:text-dark-primary">
                          wants to pray for you
                        </Text>
                      </View>
                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          onPress={() => acceptRequest.mutate(req)}
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: "#bbf7d0" }}
                        >
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color="#14532d"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => declineRequest.mutate(req)}
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: "#fecaca" }}
                        >
                          <Ionicons name="close" size={20} color="#7f1d1d" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {(friendList?.length ?? 0) === 0 ? (
              renderEmptyState()
            ) : (
              <>
                <View className="mb-4 gap-2">
                  <Text className="font-inter-bold text-xl text-light-primary dark:text-dark-primary">
                    Hey {currentUser?.full_name}
                  </Text>
                  <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
                    Here's everyone on your people list. Let them know you're
                    praying for them!
                  </Text>
                </View>
                <FlatList
                  data={friendList}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderFriendItem}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                />
              </>
            )}

            {/* Sign Out Button */}
            <View className="mt-auto">
              <TouchableOpacity
                onPress={handleSignOut}
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg justify-center items-center w-full flex-row gap-2"
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                  }
                />
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-bold text-light-primary text-lg dark:text-dark-primary"
                >
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </PeopleContainer>

      {/* Set Name Modal */}
      {currentUser && (
        <SetNameModal
          visible={showSetNameModal}
          onClose={() => setShowSetNameModal(false)}
          supabase={supabase}
          userId={currentUser.id}
          onNameSet={handleNameSet}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default PeopleScreen;

// Submit button component with mutation
const SubmitFriendCodeButton = ({
  friendCode,
  onSuccess,
  supabaseUpdate,
}: {
  friendCode: string;
  onSuccess: () => void;
  supabaseUpdate: (code: string) => Promise<Profile>;
}) => {
  const isValid = friendCode.length === 6;
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme
  );
  const mutation = useMutation({
    mutationFn: async () => await supabaseUpdate(friendCode),
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Friend code saved" });
      onSuccess();
    },
    onError: (e: unknown) => {
      console.error(e);
      Toast.show({ type: "error", text1: "Failed to save code" });
    },
  });

  return (
    <TouchableOpacity
      onPress={() =>
        isValid && !mutation.isPending ? mutation.mutate() : null
      }
      disabled={!isValid || mutation.isPending}
      className={`ml-3 p-3 rounded-full ${
        !isValid || mutation.isPending ? "opacity-50" : "opacity-100"
      }`}
      style={{
        backgroundColor: colorScheme === "dark" ? "#2f2d51" : "#e6e6f0",
      }}
    >
      {mutation.isPending ? (
        <Ionicons
          name="time-outline"
          size={22}
          color={
            actualTheme && actualTheme.PrimaryTxt
              ? actualTheme.PrimaryTxt
              : colorScheme === "dark"
              ? "white"
              : "#2f2d51"
          }
        />
      ) : (
        <Ionicons
          name="checkmark"
          size={22}
          color={
            actualTheme && actualTheme.PrimaryTxt
              ? actualTheme.PrimaryTxt
              : colorScheme === "dark"
              ? "white"
              : "#2f2d51"
          }
        />
      )}
    </TouchableOpacity>
  );
};
