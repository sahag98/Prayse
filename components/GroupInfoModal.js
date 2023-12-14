import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
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

const GroupInfoModal = ({
  groupInfoVisible,
  group,
  setGroupInfoVisible,
  currentUser,
  allUsers,
  theme,
}) => {
  const insets = useSafeAreaInsets();
  const handleCloseModal = () => {
    setGroupInfoVisible(false);
  };

  const removeUser = (userId) => {
    console.log(userId);
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
                  paddingTop: insets.top,
                  paddingBottom: insets.bottom,
                }
              : {
                  backgroundColor: "#F2F7FF",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: insets.top,
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
          <Text
            style={{
              color: "#001f3f",
              fontFamily: "Inter-Bold",
              marginBottom: 5,
              fontSize: 20,
              textAlign: "center",
              width: "100%",
            }}
          >
            {group.groups.name}
          </Text>
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
                  style={{
                    color: "#2f2d51",
                    fontFamily: "Inter-Medium",
                    fontSize: 18,
                  }}
                >
                  Group Members:
                </Text>
              }
              ListHeaderComponentStyle={{ marginBottom: 10 }}
              keyExtractor={(e, i) => i.toString()}
              initialNumToRender={30}
              ItemSeparatorComponent={
                <View style={{ width: "100%", height: 1 }} />
              }
              renderItem={({ item }) => {
                console.log(item.is_admin);
                return (
                  <View
                    style={{
                      backgroundColor: "#93d8f8",
                      borderRadius: 10,
                      width: "100%",
                      padding: 12,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
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
                          style={{
                            color: "#2f2d51",
                            fontFamily: "Inter-Medium",
                          }}
                        >
                          {currentUser.full_name == item.profiles.full_name
                            ? "You"
                            : item.profiles.full_name}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: "auto",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 5,
                          borderRadius: 10,

                          backgroundColor: "white",
                        }}
                      >
                        <Text
                          style={
                            item.is_admin == true
                              ? {
                                  color: "red",
                                  fontSize: 12,
                                  fontFamily: "Inter-Medium",
                                }
                              : {
                                  color: "#2f2d51",
                                  fontSize: 12,
                                  fontFamily: "Inter-Medium",
                                }
                          }
                        >
                          {item.is_admin == true ? "Admin" : "Member"}
                        </Text>
                      </View>
                    </View>
                    {currentUser.is_admin == true && (
                      <TouchableOpacity
                        onPress={() => removeUser(item.profiles.id)}
                        style={{ alignSelf: "flex-end" }}
                      >
                        <Text style={{ color: "red" }}>Remove</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
            />
          </View>
        </ModalContainer>
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
