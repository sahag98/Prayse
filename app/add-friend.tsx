import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Modal,
  Image,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import NetInfo from "@react-native-community/netinfo";

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
import axios from "axios";
import { ActualTheme } from "../types/reduxTypes";
import { useSupabase } from "../context/useSupabase";
import { PeopleContainer } from "@components/PeopleContainer";
import { FOLDER_SCREEN, PEOPLE_SCREEN } from "@routes";
import { Database } from "../database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
type Friend = Database["public"]["Tables"]["friends"]["Row"];
type FriendInsert = Database["public"]["Tables"]["friends"]["Insert"];

interface SupabaseContext {
  supabase: ReturnType<
    typeof import("@supabase/supabase-js").createClient<Database>
  >;
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
}

const AddFriendScreen = () => {
  const [friendCode, setFriendCode] = useState("");
  const { supabase, currentUser, setCurrentUser } =
    useSupabase() as unknown as SupabaseContext;

  const [isConnected, setIsConnected] = useState(true);
  const [friendAddCode, setFriendAddCode] = useState("");
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [pendingFriendProfile, setPendingFriendProfile] =
    useState<Profile | null>(null);
  const [createdFriendRecord, setCreatedFriendRecord] = useState<Friend | null>(
    null
  );
  const router = useRouter();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme
  );

  console.log("currentUser", currentUser);
  const { colorScheme } = useColorScheme();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (code: string) => {
      console.log("hereeee", code);
      if (!currentUser?.id) throw new Error("No user");
      const friendCodeNum = parseInt(code, 10);
      if (isNaN(friendCodeNum)) throw new Error("Invalid friend code");
      const { data, error } = await supabase
        .from("profiles")
        .update({ friend_code: friendCodeNum } satisfies ProfileUpdate)
        .eq("id", currentUser.id)
        .select()
        .single();
      console.log("data", data);
      console.log("error", error);
      if (error) throw error;
      if (!data) throw new Error("No data returned");
      setCurrentUser({ ...currentUser, friend_code: friendCodeNum });
      queryClient.setQueryData(["profile", currentUser.id], data);
      return data;
    },
    onSuccess: () => {
      Toast.show({ type: "success", text1: "Friend code saved" });
      router.back();
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Failed to save code" });
    },
  });

  const addFriendMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!currentUser?.id) throw new Error("No user");
      const sanitized = (code || "").replace(/\D/g, "").slice(0, 6);

      console.log("sanitized", sanitized);
      if (sanitized.length !== 6) throw new Error("Invalid code");

      const friendCodeNum = parseInt(sanitized, 10);
      const { data: friendProfile, error: findError } = await supabase
        .from("profiles")
        .select("*")
        .eq("friend_code", friendCodeNum)
        .single();
      if (findError) throw findError;
      console.log("friend profile: ", friendProfile);
      if (!friendProfile) throw new Error("Friend not found");
      if (friendProfile.id === currentUser.id) {
        console.log("cant add yourself");
        throw new Error("Cannot add yourself");
      }
      const message = {
        to: friendProfile.expoToken,
        sound: "default",
        title: `People 🙏`,
        body: `${
          friendProfile.full_name || "Someone"
        } wants to pray for you! Tap to confirm.`,
        data: {
          screen: PEOPLE_SCREEN,
        },
      };
      await axios.post("https://exp.host/--/api/v2/push/send", message, {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      });
      console.log("here before insert");
      const { data: inserted, error: insertError } = await supabase
        .from("friends")
        .insert({
          user_id: currentUser.id,
          friend_id: friendProfile.id,
        } satisfies FriendInsert)
        .select()
        .single();
      console.log("hereeee");
      if (insertError) throw insertError;

      setPendingFriendProfile(friendProfile);
      setCreatedFriendRecord(inserted);
      setIsConfirmModalVisible(true);

      queryClient.setQueryData(
        ["friends", currentUser.id],
        (oldData: unknown) => {
          const previous = Array.isArray(oldData) ? oldData : [];
          const exists = previous.some(
            (friend: { friend_id: string }) =>
              friend.friend_id === friendProfile.id
          );
          if (exists) return previous;

          const optimisticEntry = {
            id: inserted.id,
            friend_id: friendProfile.id,
            friend_name: friendProfile.full_name,
            avatar_url: friendProfile.avatar_url,
            expoToken: friendProfile.expoToken,
            prayer_count: inserted.prayer_count ?? 0,
            status: inserted.status ?? "pending",
          };

          return [optimisticEntry, ...previous];
        }
      );

      return inserted;
    },
    onError: (err: Error) => {
      const message = err?.message || "Failed to add friend";
      Toast.show({ type: "error", text1: message });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Friend added (pending confirmation)",
      });
      if (currentUser?.id) {
        queryClient.invalidateQueries({
          queryKey: ["friends", currentUser.id],
        });
        queryClient.invalidateQueries({
          queryKey: ["pending-requests", currentUser.id],
        });
      }
    },
  });

  const handleCancelAddFriend = async () => {
    try {
      if (createdFriendRecord?.id) {
        const { error } = await supabase
          .from("friends")
          .delete()
          .eq("id", createdFriendRecord.id);
        if (error) throw error;
      } else if (currentUser?.id && pendingFriendProfile?.id) {
        await supabase
          .from("friends")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("friend_id", pendingFriendProfile.id);
      }
    } catch (e: unknown) {
      console.error("Error canceling friend request:", e);
    } finally {
      setIsConfirmModalVisible(false);
      setPendingFriendProfile(null);
      setCreatedFriendRecord(null);
      setFriendAddCode("");
    }
  };

  const handleConfirmAddFriend = () => {
    // As requested, confirm does not perform any additional actions
    setIsConfirmModalVisible(false);
    setPendingFriendProfile(null);
    setCreatedFriendRecord(null);
    setFriendAddCode("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <PeopleContainer>
        {/* Header */}
        <View className="flex-row items-center justify-between mt-4 mb-6">
          <View className="flex-1">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-bold text-3xl text-light-primary dark:text-dark-primary"
            >
              Add People
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
        {currentUser?.friend_code && (
          <View className="bg-light-secondary p-3 self-center rounded-xl">
            <Text className="font-inter-semibold text-light-primary dark:text-dark-background">
              Share your code:{" "}
              {currentUser.friend_code.toString().padStart(6, "0")}
            </Text>
          </View>
        )}
        <View className="flex-1 justify-center items-center">
          {!currentUser?.friend_code ? (
            <>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-light-primary dark:text-dark-primary text-lg mb-4"
              >
                Before you add someone, choose a secure 6‑digit code friends can
                use to add you.
              </Text>
              <View
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className="w-full bg-light-secondary dark:bg-dark-secondary flex-row items-center p-3 rounded-xl relative justify-between"
              >
                <TextInput
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="flex-1  h-full text-light-primary dark:text-dark-primary font-inter-regular text-lg"
                  value={friendCode}
                  onChangeText={(text) => {
                    const digitsOnly = text.replace(/\D/g, "").slice(0, 6);
                    setFriendCode(digitsOnly);
                  }}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                  }
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                  selectionColor={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                  }
                />
                <SubmitFriendCodeButton
                  friendCode={friendCode}
                  isPending={mutation.isPending}
                  onPress={() => mutation.mutate(friendCode)}
                  colorScheme={colorScheme}
                  actualTheme={actualTheme}
                />
              </View>
            </>
          ) : (
            <>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-light-primary dark:text-dark-primary text-lg mb-4"
              >
                Prayer is for everyone. Once you add someone, they will always
                remain on the people list.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-light-primary dark:text-dark-primary text-lg mb-4"
              >
                Enter your friend's 6‑digit code to add them.
              </Text>

              <View
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className="w-full bg-light-secondary dark:bg-dark-secondary flex-row items-center p-3 rounded-xl relative justify-between"
              >
                <TextInput
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="flex-1 text-light-primary dark:text-dark-primary font-inter-regular text-lg"
                  value={friendAddCode}
                  onChangeText={(text) => {
                    const digitsOnly = text.replace(/\D/g, "").slice(0, 6);
                    setFriendAddCode(digitsOnly);
                  }}
                  placeholder="Enter friend's 6-digit code"
                  placeholderTextColor={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                  }
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
                  selectionColor={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                  }
                />
                <SubmitFriendCodeButton
                  friendCode={friendAddCode}
                  isPending={addFriendMutation.isPending}
                  onPress={() => addFriendMutation.mutate(friendAddCode)}
                  colorScheme={colorScheme}
                  actualTheme={actualTheme}
                />
              </View>
            </>
          )}
        </View>

        <Modal
          visible={isConfirmModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsConfirmModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-11/12 rounded-2xl p-5 bg-light-secondary dark:bg-dark-secondary"
            >
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter-bold text-xl mb-3 text-light-primary dark:text-dark-primary text-center"
              >
                Confirm Friend
              </Text>
              {pendingFriendProfile && (
                <View className="items-center mb-4">
                  {pendingFriendProfile.avatar_url ? (
                    <Image
                      source={{ uri: pendingFriendProfile.avatar_url }}
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 9999,
                        marginBottom: 8,
                      }}
                    />
                  ) : (
                    <View
                      className="w-18 h-18 rounded-full items-center justify-center mb-2"
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 9999,
                        backgroundColor:
                          colorScheme === "dark" ? "#2f2d51" : "#e6e6f0",
                      }}
                    >
                      <Ionicons
                        name="person"
                        size={32}
                        color={colorScheme === "dark" ? "white" : "#2f2d51"}
                      />
                    </View>
                  )}
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
                  >
                    {pendingFriendProfile.full_name || "Friend"}
                  </Text>
                </View>
              )}
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  onPress={handleCancelAddFriend}
                  className="flex-1 mr-2 p-3 rounded-xl"
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#2f2d51" : "white",
                  }}
                >
                  <Text
                    style={getMainTextColorStyle(actualTheme)}
                    className="text-center font-inter-semibold"
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirmAddFriend}
                  className="flex-1 ml-2 p-3 rounded-xl"
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#a5c9ff" : "#2f2d51",
                  }}
                >
                  <Text
                    style={getMainTextColorStyle(actualTheme)}
                    className="text-center text-light-background dark:text-dark-background font-inter-semibold"
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </PeopleContainer>
    </KeyboardAvoidingView>
  );
};

export default AddFriendScreen;

interface SubmitFriendCodeButtonProps {
  friendCode: string;
  isPending: boolean;
  onPress: () => void;
  colorScheme: "light" | "dark" | undefined;
  actualTheme: ActualTheme | null;
}

const SubmitFriendCodeButton = ({
  friendCode,
  isPending,
  onPress,
  colorScheme,
  actualTheme,
}: SubmitFriendCodeButtonProps) => {
  const isValid = friendCode?.length === 6;
  return (
    <TouchableOpacity
      onPress={() => (isValid && !isPending ? onPress() : null)}
      disabled={!isValid || isPending}
      className={`ml-3 p-3 rounded-full ${
        !isValid || isPending ? "opacity-50" : "opacity-100"
      }`}
      style={{
        backgroundColor: colorScheme === "dark" ? "#a5c9ff" : "#2f2d51",
      }}
    >
      {isPending ? (
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
              ? "#121212"
              : "white"
          }
        />
      )}
    </TouchableOpacity>
  );
};
