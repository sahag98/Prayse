import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Modal, Animated } from "react-native";

import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";

import uuid from "react-native-uuid";
import {
  HeaderTitle,
  HeaderView,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";

import { useSelector } from "react-redux";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import EditGroupModal from "./EditGroupModal";
import { useNavigation } from "@react-navigation/native";

// import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const GroupInfoMenu = ({
  theme,
  group,
  currentUser,
  handleRemoveConfirmation,
  userToEdit,
  setShowMenu,
  setUserToEdit,
  onAnimationComplete,
}) => {
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => onAnimationComplete());
  }, [onAnimationComplete, slideAnim]);
  return (
    <Animated.View
      style={[
        styles.menuContainer,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [400, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View
        style={
          theme === "dark"
            ? { ...styles.menuContent, backgroundColor: "#212121" }
            : { ...styles.menuContent, backgroundColor: "#93d8f8" }
        }
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 15,
            }}
          >
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{
                uri:
                  userToEdit.avatar_url ||
                  "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
              }}
            />
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "white",
                      fontFamily: "Inter-Medium",
                      fontSize: 15,
                    }
                  : {
                      color: "#2f2d51",
                      fontFamily: "Inter-Medium",
                      fontSize: 15,
                    }
              }
            >
              {userToEdit.full_name}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              borderRadius: 200,
              backgroundColor: theme == "dark" ? "#121212" : "#2f2d51",
              padding: 10,
            }}
            onPress={() => setShowMenu(false)}
          >
            <AntDesign
              name="close"
              size={24}
              color={theme == "dark" ? "white" : "white"}
            />
          </TouchableOpacity>
        </View>
        {group.user_id == currentUser.id &&
          group.is_admin == true &&
          currentUser.id != userToEdit.id && (
            <View
              style={{
                backgroundColor: "#121212",
                width: "100%",
                marginTop: 20,
                marginBottom: 20,
                borderRadius: 10,
                flex: 1,
              }}
            >
              {/* <TouchableOpacity
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 18,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() =>
                  handleRemoveConfirmation(userToEdit.id, userToEdit.full_name)
                }
              >
                <Text
                  style={
                    theme === "dark"
                      ? { ...styles.menuItem, color: "#a5c9ff" }
                      : styles.menuItem
                  }
                >
                  Make Admin
                </Text>
                <Octicons name="shield-check" size={24} color="#a5c9ff" />
              </TouchableOpacity> */}
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: 15,
                }}
              >
                {/* <View
                  style={{
                    width: "100%",

                    height: 1,
                    backgroundColor: "#2e2e2e",
                  }}
                /> */}
              </View>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 18,
                  backgroundColor: theme == "dark" ? "#121212" : "#2f2d51",
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onPress={() => handleRemoveConfirmation(userToEdit)}
              >
                <Text
                  style={
                    theme === "dark"
                      ? { ...styles.menuItem, color: "#ff2727" }
                      : { ...styles.menuItem, color: "white" }
                  }
                >
                  Remove User
                </Text>
                <MaterialIcons
                  name="remove-circle-outline"
                  size={24}
                  color="#ff2727"
                />
              </TouchableOpacity>
            </View>
          )}
      </View>
    </Animated.View>
  );
};

const GroupInfoModal = ({
  groupInfoVisible,
  group,
  setGroupInfoVisible,
  currentUser,
  allUsers,
  theme,
  supabase,
}) => {
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState(group.groups.name);
  const [openEdit, setOpenEdit] = useState(false);
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
    console.log("removing: ", user);

    let { data: groupMessages, error } = await supabase
      .from("messages")
      .delete()
      .eq("group_id", group.group_id)
      .eq("user_id", user.id);

    let { data, MemberError } = await supabase
      .from("members")
      .delete()
      .eq("group_id", group.group_id)
      .eq("user_id", user.id);

    setShowMenu(false);
    setGroupInfoVisible(false);
    setUserToEdit(null);
  };

  const handleLeaveConfirmation = () => {
    setShowLeaveConfirmation(true);
  };

  const handleRemoveConfirmation = (user) => {
    setShowRemoveConfirmation(true);
  };

  const leaveGroup = async () => {
    let { data, MemberError } = await supabase
      .from("members")
      .delete()
      .eq("group_id", group.group_id)
      .eq("user_id", currentUser.id);
    console.log("here");
    navigation.navigate("Community");
    setGroupInfoVisible(false);
  };

  const handleDeleteConfirmation = () => {
    setShowConfirmation(true);
  };

  const handleCloseRemove = () => {
    setShowRemoveConfirmation(false);
    setShowMenu(false);
  };

  handleEditUser = (user) => {
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
    let { data, error } = await supabase
      .from("groups")
      .delete()
      .eq("id", group.group_id)
      .eq("admin_id", currentUser.id);
    console.log("deleting whole group");

    if (error) {
      console.log(error);
    }
    navigation.navigate("Community");
    setGroupInfoVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={groupInfoVisible}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, height: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ModalContainer
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#121212",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: Platform.OS == "ios" ? insets.top : 0,
                  paddingBottom: insets.bottom,
                }
              : {
                  backgroundColor: "#F2F7FF",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: Platform.OS == "ios" ? insets.top : 0,
                  paddingBottom: insets.bottom,
                }
          }
        >
          <HeaderView
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 10,
            }}
          >
            <TouchableOpacity onPress={handleCloseModal}>
              <AntDesign
                name="close"
                size={33}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </TouchableOpacity>
            <HeaderTitle
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", color: "white" }
                  : { fontFamily: "Inter-Bold", color: "#2F2D51" }
              }
            >
              Group Settings
            </HeaderTitle>
          </HeaderView>
          {group.user_id == currentUser.id && group.is_admin == true ? (
            <>
              <TouchableOpacity
                onPress={() => setOpenEdit(true)}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100%",
                  gap: 5,
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "white",
                          fontFamily: "Inter-Bold",
                          marginBottom: 10,
                          fontSize: 22,
                          textAlign: "center",
                        }
                      : {
                          color: "#2f2d51",
                          fontFamily: "Inter-Bold",
                          marginBottom: 10,
                          fontSize: 22,
                          textAlign: "center",
                        }
                  }
                >
                  {group.groups.name}
                </Text>
                <Feather
                  style={{ marginBottom: 10 }}
                  name="edit-2"
                  size={22}
                  color={theme == "dark" ? "white" : "#2f2d51"}
                />
              </TouchableOpacity>
              <EditGroupModal
                theme={theme}
                group={group}
                supabase={supabase}
                groupName={groupName}
                setGroupInfoVisible={setGroupInfoVisible}
                setGroupName={setGroupName}
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
              />
            </>
          ) : (
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "white",
                      fontFamily: "Inter-Bold",
                      marginBottom: 15,
                      fontSize: 20,
                      textAlign: "center",
                      width: "100%",
                    }
                  : {
                      color: "#2f2d51",
                      fontFamily: "Inter-Bold",
                      marginBottom: 10,
                      fontSize: 20,
                      textAlign: "center",
                      width: "100%",
                    }
              }
            >
              {group.groups.name}
            </Text>
          )}

          {group.groups.description && (
            <Text
              style={{
                color: "grey",
                fontFamily: "Inter-Regular",
                marginBottom: 20,
                fontSize: 18,
                textAlign: "center",
                width: "100%",
              }}
            >
              {group.groups.description}
            </Text>
          )}
          <View style={{ width: "100%", flex: 1 }}>
            <FlatList
              data={allUsers}
              ListHeaderComponent={
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "white",
                          fontFamily: "Inter-Medium",
                          fontSize: 18,
                        }
                      : {
                          color: "#2f2d51",
                          fontFamily: "Inter-Medium",
                          fontSize: 18,
                        }
                  }
                >
                  Group Members:
                </Text>
              }
              ListHeaderComponentStyle={{ marginBottom: 10 }}
              keyExtractor={(e, i) => i.toString()}
              initialNumToRender={30}
              ItemSeparatorComponent={
                <View style={{ width: "100%", height: 3 }} />
              }
              renderItem={({ item }) => {
                return (
                  <View
                    style={
                      theme == "dark"
                        ? {
                            backgroundColor: "#212121",
                            borderRadius: 10,
                            width: "100%",
                            padding: 12,
                          }
                        : {
                            backgroundColor: "#93d8f8",
                            borderRadius: 10,
                            width: "100%",
                            padding: 12,
                          }
                    }
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Image
                          style={{ width: 50, height: 50, borderRadius: 50 }}
                          source={{
                            uri:
                              item.profiles.avatar_url ||
                              "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
                          }}
                        />
                        <Text
                          style={
                            theme == "dark"
                              ? {
                                  color: "white",
                                  fontFamily: "Inter-Medium",
                                  fontSize: 15,
                                }
                              : {
                                  color: "#2f2d51",
                                  fontFamily: "Inter-Medium",
                                  fontSize: 15,
                                }
                          }
                        >
                          {currentUser.full_name == item.profiles.full_name
                            ? "You"
                            : item.profiles.full_name}
                        </Text>
                      </View>
                      <Entypo
                        onPress={() => handleEditUser(item.profiles)}
                        name="chevron-right"
                        size={24}
                        color={theme == "dark" ? "white" : "#2f2d51"}
                      />
                      {/* <View
                        style={
                          theme == "dark"
                            ? {
                                marginLeft: "auto",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 5,
                                borderRadius: 10,
                                backgroundColor: "#121212",
                              }
                            : {
                                marginLeft: "auto",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 5,
                                borderRadius: 10,
                                backgroundColor: "white",
                              }
                        }
                      >
                        <Text
                          style={
                            theme == "dark"
                              ? {
                                  color:
                                    item.is_admin == true ? "#ff3b3b" : "white",
                                  fontSize: 12,
                                  fontFamily: "Inter-Medium",
                                }
                              : {
                                  color:
                                    item.is_admin == true
                                      ? "#ff3b3b"
                                      : "#2f2d51",
                                  fontSize: 12,
                                  fontFamily: "Inter-Medium",
                                }
                          }
                        >
                          {item.is_admin == true ? "Admin" : "Member"}
                        </Text>
                      </View> */}
                    </View>
                    {/* {group.user_id == currentUser.id &&
                      group.is_admin == true &&
                      currentUser.id != item.profiles.id && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 15,
                            marginTop: 10,
                            alignSelf: "flex-end",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveConfirmation(
                                item.profiles.id,
                                item.profiles.full_name
                              )
                            }
                            style={{ alignSelf: "flex-end" }}
                          >
                            <Text
                              style={{
                                color: "#a5c9ff",
                                fontFamily: "Inter-Bold",
                              }}
                            >
                              Make Admin
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveConfirmation(
                                item.profiles.id,
                                item.profiles.full_name
                              )
                            }
                            style={{ alignSelf: "flex-end" }}
                          >
                            <Text
                              style={{
                                color: "#ff2727",
                                fontFamily: "Inter-Bold",
                              }}
                            >
                              Remove
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )} */}
                  </View>
                );
              }}
            />
            {group.groups.admin_id != currentUser.id && (
              <TouchableOpacity
                onPress={handleLeaveConfirmation}
                style={{
                  backgroundColor: theme == "dark" ? "#212121" : "#2f2d51",
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 8,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <Ionicons name="exit-outline" size={36} color="white" />
                <Text style={{ color: "white", fontFamily: "Inter-Bold" }}>
                  Leave group
                </Text>
              </TouchableOpacity>
            )}
            {group.groups.admin_id == currentUser.id && (
              <>
                {/* <TouchableOpacity
                  onPress={handleDeleteConfirmation}
                  style={{
                    backgroundColor: theme == "dark" ? "#212121" : "#2f2d51",
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                    marginBottom: 10,
                    borderRadius: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={36}
                    color="white"
                  />
                  <Text style={{ color: "white", fontFamily: "Inter-Bold" }}>
                    Announce Prayer Group Meeting
                  </Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={handleDeleteConfirmation}
                  style={{
                    backgroundColor: theme == "dark" ? "#212121" : "#2f2d51",
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 8,
                    marginBottom: 10,
                    borderRadius: 10,
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={36}
                    color="#ff2727"
                  />
                  <Text style={{ color: "#ff2727", fontFamily: "Inter-Bold" }}>
                    Delete group
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ModalContainer>
        {showMenu && (
          <GroupInfoMenu
            theme={theme}
            handleRemoveConfirmation={handleRemoveConfirmation}
            userToEdit={userToEdit}
            group={group}
            onAnimationComplete={handleAnimationComplete}
            setShowMenu={setShowMenu}
            setUserToEdit={setUserToEdit}
            currentUser={currentUser}
          />
        )}
        {showRemoveConfirmation && (
          <View
            // entering={FadeIn.duration(500)}
            // exiting={FadeOut.duration(500)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <View
              style={{
                backgroundColor: theme == "dark" ? "#212121" : "#93d8f8",
                padding: 20,
                borderRadius: 10,
                width: "80%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme == "dark" ? "white" : "#2f2d51",
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                }}
              >
                Are you sure you want to remove {userToEdit.full_name} from this
                group ?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity onPress={handleCloseRemove}>
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      fontSize: 16,
                      color: "red",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeUser(userToEdit)}>
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      fontSize: 16,
                      color: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {showLeaveConfirmation && (
          <View
            // entering={FadeIn.duration(500)}
            // exiting={FadeOut.duration(500)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <View
              style={{
                backgroundColor: theme == "dark" ? "#212121" : "#93d8f8",
                padding: 20,
                borderRadius: 10,
                width: "80%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme == "dark" ? "white" : "#2f2d51",
                  fontFamily: "Inter-Medium",
                  fontSize: 18,
                }}
              >
                Are you sure you want to leave this group?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowLeaveConfirmation(false)}
                >
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      fontSize: 16,
                      color: "red",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={leaveGroup}>
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      fontSize: 16,
                      color: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {showConfirmation && (
          <View
            // entering={FadeIn.duration(500)}
            // exiting={FadeOut.duration(500)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <View
              style={{
                backgroundColor: theme == "dark" ? "#212121" : "#93d8f8",
                padding: 20,
                borderRadius: 10,
                width: "80%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme == "dark" ? "white" : "#2f2d51",
                  fontFamily: "Inter-Medium",
                  fontSize: 18,
                }}
              >
                Are you sure you want to delete this group? This action will
                also remove all members.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity onPress={() => setShowConfirmation(false)}>
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      fontSize: 16,
                      color: "red",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteGroup}>
                  <Text
                    style={{
                      fontFamily: "Inter-Bold",
                      fontSize: 16,
                      color: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                    }}
                  >
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default GroupInfoModal;

const styles = StyleSheet.create({
  inputField: {
    marginVertical: 10,
    width: "100%",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "100%",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    padding: 5,
  },
  dismiss: {
    padding: 2,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "100%",
    borderBottomColor: "#2f2d51",
    borderBottomWidth: 1,
    padding: 5,
  },
  logoutDark: {
    alignSelf: "flex-end",
    backgroundColor: "#212121",
    marginVertical: 10,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    position: "absolute",

    height: "auto",
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuContent: {
    width: "100%",
    height: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  menuItem: {
    fontSize: 16,

    fontFamily: "Inter-Regular",
  },
  logout: {
    alignSelf: "flex-end",
    marginVertical: 15,
    backgroundColor: "#2f2d51",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  iconContainer: {
    position: "relative",
    alignSelf: "center",
    padding: 8,
  },
  featherIconDark: {
    position: "absolute",
    backgroundColor: "#3e3e3e",
    borderRadius: 50,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    bottom: 6,
    right: 12,
  },
  featherIcon: {
    position: "absolute",
    backgroundColor: "#93d8f8",
    borderRadius: 50,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    bottom: 6,
    right: 12,
  },
});
