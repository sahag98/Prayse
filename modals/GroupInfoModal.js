import React, { useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { COMMUNITY_SCREEN, HOME_SCREEN } from "../routes";
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import Animated from "react-native-reanimated";
import { router, useNavigation } from "expo-router";

const GroupInfoModal = ({
  groupInfoVisible,
  actualTheme,
  group,
  setGroupInfoVisible,
  currentUser,
  groupUsers,
  theme,
  supabase,
}) => {
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleCloseModal = () => {
    setGroupInfoVisible(false);
  };

  const removeUser = async (user) => {
    console.log("user to remove: ", user.id);
    await supabase
      .from("messages")
      .delete()
      .eq("group_id", group.id)
      .eq("user_id", user.id);

    await supabase
      .from("members")
      .delete()
      .eq("group_id", group.id)
      .eq("user_id", user.id);

    setShowMenu(false);
    setGroupInfoVisible(false);
    setUserToEdit(null);
  };

  const handleLeaveConfirmation = () => {
    setShowLeaveConfirmation(true);
  };

  const handleRemoveConfirmation = (user) => {
    console.log("handle remove");
    setShowRemoveConfirmation(true);
    setUserToEdit(user);
  };

  const leaveGroup = async () => {
    await supabase
      .from("members")
      .delete()
      .eq("group_id", group.id)
      .eq("user_id", currentUser.id);
    navigation.navigate(COMMUNITY_SCREEN);
    setGroupInfoVisible(false);
  };

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCloseRemove = () => {
    setShowRemoveConfirmation(false);
    setShowMenu(false);
  };

  const handleEditUser = (user) => {
    console.log("user to edit: ", user);
    setUserToEdit(user);
    setShowMenu(true);
  };
  const handleAnimationComplete = () => {
    if (!showMenu) {
      // Reset state after menu is hidden
      setUserToEdit(null);
    }
  };

  const deleteGroup = async () => {
    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", group.id)
      .eq("admin_id", currentUser.id);

    if (error) {
      console.log(error);
    }
    router.replace(`${HOME_SCREEN}?active=community`);
    // navigation.navigate(HOME_SCREEN);
    setGroupInfoVisible(false);
  };

  const handleRemoveUser = async (user) => {
    console.log("User to remove: ", user);
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={groupInfoVisible}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, height: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          className="bg-light-background dark:bg-dark-background"
          style={
            actualTheme && actualTheme.Bg
              ? {
                  backgroundColor: actualTheme.Bg,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: Platform.OS == "ios" ? insets.top : 0,
                  paddingBottom: insets.bottom,
                }
              : theme == "dark"
              ? {
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: Platform.OS == "ios" ? insets.top : 0,
                  paddingBottom: insets.bottom,
                }
              : {
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: Platform.OS == "ios" ? insets.top : 0,
                  paddingBottom: insets.bottom,
                }
          }
        >
          <View className="flex-row gap-3">
            <TouchableOpacity onPress={handleCloseModal}>
              <AntDesign
                name="close"
                size={33}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : theme == "dark"
                    ? "white"
                    : "#2f2d51"
                }
              />
            </TouchableOpacity>
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-bold text-light-primary dark:text-dark-primary"
            >
              Group Settings
            </Text>
          </View>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="text-center self-center my-5 font-inter-semibold text-2xl text-light-primary dark:text-dark-primary"
          >
            {group.name}
          </Text>
          <View className="w-full flex-1">
            <FlatList
              data={groupUsers}
              ListHeaderComponent={
                <View
                  style={
                    actualTheme &&
                    actualTheme.Secondary && {
                      borderBottomColor: actualTheme.Secondary,
                    }
                  }
                  className="border-b-2 border-b-light-secondary dark:border-b-dark-[#d2d2d2] p-1"
                >
                  <Text
                    style={getMainTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary"
                  >
                    Members
                  </Text>
                </View>
              }
              keyExtractor={(item) => item.id.toString()}
              initialNumToRender={30}
              // ItemSeparatorComponent={
              //   <View style={{ width: "100%", height: 3 }} />
              // }
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleEditUser(item.profiles)}
                    style={
                      actualTheme &&
                      actualTheme.Secondary && {
                        borderBottomColor: actualTheme.Secondary,
                      }
                    }
                    className="border-b border-b-light-secondary dark:border-b-dark-[#d2d2d2] p-3"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <Image
                          className="size-14 rounded-full"
                          source={{
                            uri:
                              item.profiles.avatar_url ||
                              "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
                          }}
                        />
                        <Text
                          style={getMainTextColorStyle(actualTheme)}
                          className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
                        >
                          {currentUser.full_name === item.profiles.full_name
                            ? "You"
                            : item.profiles.full_name}
                        </Text>
                      </View>
                      {currentUser.full_name !== item.profiles.full_name &&
                        group?.admin_id === currentUser.id && (
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveConfirmation(item.profiles)
                            }
                            className="p-3 bg-red-100 border border-red-300 rounded-full"
                          >
                            <Ionicons
                              name="person-remove-outline"
                              size={20}
                              color={
                                actualTheme && actualTheme.MainTxt
                                  ? actualTheme.MainTxt
                                  : theme === "dark"
                                  ? "white"
                                  : "#2f2d51"
                              }
                            />
                          </TouchableOpacity>
                        )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            {group?.admin_id !== currentUser.id ? (
              <TouchableOpacity
                onPress={handleLeaveConfirmation}
                className="bg-light-secondary dark:bg-dark-secondary flex-row gap-3 justify-center items-center p-3 rounded-lg mb-3"
              >
                <Ionicons name="exit-outline" size={33} color="#ff2727" />
                <Text className="font-inter-bold text-lg text-red-500">
                  Leave group
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                onPress={handleDeleteConfirmation}
                className="bg-light-secondary w-11/12 self-center dark:bg-dark-secondary flex-row gap-3 justify-center items-center p-3 rounded-lg mb-3"
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={33}
                  color="#ff2727"
                />
                <Text className="font-inter-bold text-lg text-red-500">
                  Delete group
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* {showMenu && (
          <GroupInfoMenu
            theme={theme}
            actualTheme={actualTheme}
            handleRemoveConfirmation={handleRemoveConfirmation}
            userToEdit={userToEdit}
            group={group}
            onAnimationComplete={handleAnimationComplete}
            setShowMenu={setShowMenu}
            setUserToEdit={setUserToEdit}
            currentUser={currentUser}
          />
        )} */}
        {showRemoveConfirmation && (
          <View className="flex-1 justify-center items-center absolute top-0 right-0 bottom-0 left-0 bg-black/25">
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="p-5 rounded-lg w-4/5 items-center bg-light-secondary dark:bg-dark-secondary"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
              >
                Are you sure you want to remove{" "}
                <Text className="font-inter-semibold">
                  {userToEdit.full_name}
                </Text>{" "}
                from this group ?
              </Text>
              <View className="flex-row justify-between w-full mt-5">
                <TouchableOpacity onPress={handleCloseRemove}>
                  <Text className="font-inter-bold text-lg text-red-500">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeUser(userToEdit)}>
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-bold text-lg text-light-primary dark:text-dark-accent"
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {showLeaveConfirmation && (
          <View className="flex-1 justify-center items-center absolute top-0 right-0 bottom-0 left-0 bg-black/25">
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="p-5 rounded-lg w-4/5 items-center bg-light-secondary dark:bg-dark-secondary"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
              >
                Are you sure you want to leave this group?
              </Text>
              <View className="flex-row justify-between w-full mt-5">
                <TouchableOpacity
                  onPress={() => setShowLeaveConfirmation(false)}
                >
                  <Text className="font-inter-bold text-lg text-red-500">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={leaveGroup}>
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-bold text-lg text-light-primary dark:text-dark-accent"
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {showConfirmation && (
          <Animated.View
            // style={opacityAnimationStyle}
            className="flex-1 justify-center items-center absolute top-0 right-0 bottom-0 left-0 bg-black/25"
          >
            <Animated.View
              style={[getSecondaryBackgroundColorStyle(actualTheme)]}
              className="p-5 rounded-lg w-4/5 items-center bg-light-secondary dark:bg-dark-secondary"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
              >
                Are you sure you want to delete this group? This action will
                also remove all members.
              </Text>
              <View className="flex-row justify-between w-full mt-5">
                <TouchableOpacity onPress={() => setShowConfirmation(false)}>
                  <Text className="font-inter-bold text-lg text-red-500">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteGroup}>
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-bold text-lg text-light-primary dark:text-dark-accent"
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default GroupInfoModal;
