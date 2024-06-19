import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import groupBg from "../assets/group-bg.png";
import { COMMUNITY_SCREEN } from "../routes";
import { HeaderTitle, HeaderView, ModalContainer } from "../styles/appStyles";

import EditGroupModal from "./EditGroupModal";
import GroupTemplateModal from "./GroupTemplateModal";

const GroupInfoMenu = ({
  theme,
  group,
  currentUser,
  handleRemoveConfirmation,
  userToEdit,
  setShowMenu,
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
            : { ...styles.menuContent, backgroundColor: "#b7d3ff" }
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
                theme === "dark"
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
              backgroundColor: theme === "dark" ? "#121212" : "#2f2d51",
              padding: 10,
            }}
            onPress={() => setShowMenu(false)}
          >
            <AntDesign
              name="close"
              size={24}
              color={theme === "dark" ? "white" : "white"}
            />
          </TouchableOpacity>
        </View>
        {group.user_id === currentUser.id &&
          group.is_admin === true &&
          currentUser.id !== userToEdit.id && (
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
              <View
                style={{
                  width: "100%",
                  paddingHorizontal: 15,
                }}
              />
              <TouchableOpacity
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 18,
                  backgroundColor: theme === "dark" ? "#121212" : "#2f2d51",
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
  const [groupImage, setGroupImage] = useState(null);
  const [isShowingGroupTemplates, setIsShowingGroupTemplates] = useState(false);

  const [imgUrl, setImgUrl] = useState(null);
  const handleCloseModal = () => {
    setGroupInfoVisible(false);
  };

  const removeUser = async (user) => {
    await supabase
      .from("messages")
      .delete()
      .eq("group_id", group.group_id)
      .eq("user_id", user.id);

    await supabase
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

  const handleRemoveConfirmation = () => {
    setShowRemoveConfirmation(true);
  };

  const leaveGroup = async () => {
    await supabase
      .from("members")
      .delete()
      .eq("group_id", group.group_id)
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

  handleEditUser = (user) => {
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
      .eq("id", group.group_id)
      .eq("admin_id", currentUser.id);

    if (error) {
      console.log(error);
    }
    navigation.navigate(COMMUNITY_SCREEN);
    setGroupInfoVisible(false);
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const photoPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast(
          "error",
          "We need camera roll permissions to make this work!",
        );
      } else {
        pickImage();
      }
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
      const ext = result.assets[0].uri.substring(
        result.assets[0].uri.lastIndexOf(".") + 1,
      );

      const fileName = result.assets[0].uri.replace(/^.*[\\\/]/, "");

      const filePath = `${fileName}`;
      const formData = new FormData();
      formData.append("files", {
        uri: result.assets[0].uri,
        name: fileName,
        type: result.assets[0].type ? `image/${ext}` : `video/${ext}`,
      });

      const { error: uploadError } = await supabase.storage
        .from("group")
        .upload(filePath, formData);

      if (uploadError) {
        throw uploadError;
      }

      const { data: imageData, error: getUrlError } = await supabase.storage
        .from("group")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry

      setImgUrl(imageData.signedUrl);
      if (getUrlError) {
        throw getUrlError;
      }

      const { error } = await supabase
        .from("groups")
        .update({
          group_img: imageData.signedUrl,
        })
        .eq("id", group.group_id);

      if (error) {
        throw error;
      }
    }
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
              <View style={styles.iconContainer}>
                <Image
                  style={[
                    styles.profileImg,
                    {
                      backgroundColor: group.groups.group_img ? null : "grey",
                      borderWidth: 1,
                      borderColor: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                    },
                  ]}
                  source={
                    imgUrl
                      ? { uri: imgUrl }
                      : !imgUrl && !group.groups.group_img
                        ? groupBg
                        : {
                            uri: group.groups.group_img,
                          }
                  }
                />
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    color: theme == "dark" ? "white" : "#2f2d51",
                  }}
                >
                  Choose group image from:
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme == "dark" ? "#212121" : "#deebff",
                      flexDirection: "row",
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: theme == "dark" ? "#212121" : "#2f2d51",
                      alignItems: "center",
                      gap: 10,
                    }}
                    onPress={() => setIsShowingGroupTemplates(true)}
                  >
                    <Ionicons
                      name="images-outline"
                      size={20}
                      color={theme == "dark" ? "white" : "black"}
                    />

                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        color: theme == "dark" ? "white" : "#2f2d51",
                      }}
                    >
                      Templates
                    </Text>
                    <GroupTemplateModal
                      theme={theme}
                      group={group}
                      isShowingGroupTemplates={isShowingGroupTemplates}
                      setIsShowingGroupTemplates={setIsShowingGroupTemplates}
                      setImgUrl={setImgUrl}
                      setGroupImage={setGroupImage}
                      supabase={supabase}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme == "dark" ? "#212121" : "#deebff",
                      flexDirection: "row",
                      padding: 10,
                      borderRadius: 10,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: theme == "dark" ? "#212121" : "#2f2d51",
                      gap: 10,
                    }}
                    onPress={photoPermission}
                  >
                    <AntDesign
                      name="plus"
                      size={20}
                      color={theme == "dark" ? "white" : "black"}
                    />
                    <Text
                      style={{
                        fontFamily: "Inter-Medium",
                        color: theme == "dark" ? "white" : "#2f2d51",
                      }}
                    >
                      Photo Library
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setOpenEdit(true)}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100%",
                  gap: 5,
                  marginBottom: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "white",
                          fontFamily: "Inter-Bold",
                          marginBottom: 5,
                          fontSize: 22,
                          textAlign: "center",
                        }
                      : {
                          color: "#2f2d51",
                          fontFamily: "Inter-Bold",
                          marginBottom: 5,
                          fontSize: 22,
                          textAlign: "center",
                        }
                  }
                >
                  {group.groups.name}
                </Text>
                <Feather
                  style={{ marginBottom: 5 }}
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
            <>
              <View style={styles.iconContainer}>
                <Image
                  style={[
                    styles.profileImg,
                    { backgroundColor: group.groups.group_img ? null : "grey" },
                  ]}
                  source={
                    groupImage
                      ? groupImage
                      : !groupImage && !group.groups.group_img
                        ? groupBg
                        : {
                            uri: group.groups.group_img,
                          }
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100%",
                  gap: 5,
                  marginBottom: 5,
                  alignItems: "center",
                }}
              >
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "white",
                          fontFamily: "Inter-Bold",
                          marginBottom: 5,
                          fontSize: 22,
                          textAlign: "center",
                        }
                      : {
                          color: "#2f2d51",
                          fontFamily: "Inter-Bold",
                          marginBottom: 5,
                          fontSize: 22,
                          textAlign: "center",
                        }
                  }
                >
                  {group.groups.name}
                </Text>
              </View>
            </>
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
                          fontSize: 17,
                        }
                      : {
                          color: "#2f2d51",
                          fontFamily: "Inter-Medium",
                          fontSize: 17,
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
                            backgroundColor: "#b7d3ff",
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
                        color={theme === "dark" ? "white" : "#2f2d51"}
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
            {group.groups.admin_id !== currentUser.id && (
              <TouchableOpacity
                onPress={handleLeaveConfirmation}
                style={{
                  backgroundColor: theme === "dark" ? "#212121" : "#2f2d51",
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 8,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                <Ionicons name="exit-outline" size={36} color="#ff2727" />
                <Text style={{ color: "#ff2727", fontFamily: "Inter-Bold" }}>
                  Leave group
                </Text>
              </TouchableOpacity>
            )}
            {group.groups.admin_id === currentUser.id && (
              <>
                <TouchableOpacity
                  onPress={handleDeleteConfirmation}
                  style={{
                    backgroundColor: theme === "dark" ? "#212121" : "#2f2d51",
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
                backgroundColor: theme === "dark" ? "#212121" : "#b7d3ff",
                padding: 20,
                borderRadius: 10,
                width: "80%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme === "dark" ? "white" : "#2f2d51",
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
                      color: theme === "dark" ? "#a5c9ff" : "#2f2d51",
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
                backgroundColor: theme === "dark" ? "#212121" : "#b7d3ff",
                padding: 20,
                borderRadius: 10,
                width: "80%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme === "dark" ? "white" : "#2f2d51",
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
                      color: theme === "dark" ? "#a5c9ff" : "#2f2d51",
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
                backgroundColor: theme === "dark" ? "#212121" : "#b7d3ff",
                padding: 20,
                borderRadius: 10,
                width: "80%",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme === "dark" ? "white" : "#2f2d51",
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
                      color: theme === "dark" ? "#a5c9ff" : "#2f2d51",
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
    alignItems: "center",
    gap: 10,
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
