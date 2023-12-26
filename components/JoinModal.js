import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Modal } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { HeaderView, ModalContainer } from "../styles/appStyles";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const JoinModal = ({
  modalVisible,
  getUserGroups,
  getGroupUsers,
  supabase,
  setModalVisible,
  user,
  theme,
}) => {
  const [code, setCode] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [joinError, setJoinError] = useState(false);
  const insets = useSafeAreaInsets();
  const handleCloseModal = () => {
    setModalVisible(false);
    setJoinError(false);
    setCode("");
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const joinGroup = async () => {
    if (code.length <= 0) {
      showToast("error", "The group name field can't be empty.");
      setModalVisible(false);
      return;
    } else {
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("code, id")
        .eq("code", code);

      if (group.length == 0) {
        setJoinError(true);

        setCode("");
        return;
      } else if (group.length > 0) {
        let { data: members, error } = await supabase
          .from("members")
          .select("*")
          .eq("group_id", group[0].id)
          .eq("user_id", user.id);

        if (members.length > 0) {
          console.log("You have already joined this group.");
        } else {
          console.log(`Joining group${group[0].code}`);
          const { data, error } = await supabase.from("members").insert({
            group_id: group[0].id,
            user_id: user.id,
          });
          showToast("success", "Prayer group joined successfully.");
          setJoinError(false);
        }
      }

      // const { data, error } = await supabase.from("groups").insert({
      //   name: groupName,
      //   description: description,
      //   color: color,
      //   code: pin,
      // });

      // // generateGroupMembers()
      // if (error) {
      //   showToast("error", "Something went wrong. Try again.");
      // }

      // const { data: insertedData, error: fetchError } = await supabase
      //   .from("groups")
      //   .select("id")
      //   .eq("code", pin)
      //   .single();

      // if (insertedData) {
      //   const insertedGroupId = insertedData.id;
      //   const { data, error } = await supabase.from("members").insert({
      //     group_id: insertedGroupId,
      //     user_id: user.id,
      //   });
      //   // Do something with the inserted group ID
      // }
      getUserGroups();
      getGroupUsers();
      setCode("");
      setModalVisible(false);
      setIsEnabled(false);
    }
  };

  return (
    <SafeAreaProvider>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <ModalContainer
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#121212",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingTop: Platform.OS == "ios" ? insets.top : 0,
                  paddingBottom: Platform.OS == "ios" ? insets.bottom : 0,
                }
              : {
                  backgroundColor: "#F2F7FF",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingTop: Platform.OS == "ios" ? insets.top : 0,
                  paddingBottom: Platform.OS == "ios" ? insets.bottom : 0,
                }
          }
        >
          <HeaderView
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={handleCloseModal}>
              <AntDesign
                name="left"
                size={30}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </TouchableOpacity>
          </HeaderView>
          <View style={styles.inputField}>
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "white",
                      fontSize: 20,
                      marginBottom: 5,
                      letterSpacing: 1,
                      fontFamily: "Inter-Bold",
                    }
                  : {
                      color: "#2f2d51",
                      fontSize: 20,
                      marginBottom: 5,
                      letterSpacing: 1,
                      fontFamily: "Inter-Bold",
                    }
              }
            >
              Join A Prayer Group
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TextInput
                style={
                  theme == "dark"
                    ? code.length < 6
                      ? [styles.nameDark, { width: "100%" }]
                      : styles.nameDark
                    : code.length < 6
                    ? [styles.name, { width: "100%" }]
                    : styles.name
                }
                // autoFocus={modalVisible}
                maxLength={6}
                keyboardType="numeric"
                placeholder="Enter 6 digit group code"
                placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
                selectionColor={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
                value={code}
                onChangeText={(text) => setCode(text)}
              />
              <TouchableOpacity onPress={joinGroup}>
                {code.length == 6 && (
                  <Animated.View
                    entering={FadeIn.duration(500)}
                    exiting={FadeOut.duration(500)}
                  >
                    <AntDesign
                      name="rightcircle"
                      size={40}
                      color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
                    />
                  </Animated.View>
                )}
              </TouchableOpacity>
            </View>
            {joinError && (
              <Text
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "Inter-Medium",
                  fontSize: 13,
                  color: "#ff4e4e",
                }}
              >
                Group doesn't exist try again.
              </Text>
            )}

            <View style={{ marginTop: 5, width: "100%" }}>
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#d2d2d2",
                        fontFamily: "Inter-Regular",
                        fontSize: 13,
                      }
                    : {
                        color: "#2f2d51",
                        fontFamily: "Inter-Regular",
                        fontSize: 13,
                      }
                }
              >
                "For where two or three are gathered together in my name, there
                am I in the midst of them."
              </Text>
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "white",
                        alignSelf: "flex-end",
                        fontFamily: "Inter-Medium",
                        fontSize: 13,
                      }
                    : {
                        color: "#2f2d51",
                        alignSelf: "flex-end",
                        fontFamily: "Inter-Medium",
                        fontSize: 13,
                      }
                }
              >
                - Matthew 18:20
              </Text>
            </View>
          </View>
        </ModalContainer>
      </Modal>
    </SafeAreaProvider>
  );
};

export default JoinModal;

const styles = StyleSheet.create({
  nameDark: {
    backgroundColor: "#212121",
    padding: 15,
    width: "85%",
    borderRadius: 10,
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    justifyContent: "center",
    alignSelf: "center",
  },
  name: {
    padding: 15,
    backgroundColor: "#deebff",
    color: "#2f2d51",
    borderRadius: 10,
    width: "85%",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    justifyContent: "center",
    alignSelf: "center",
  },
  inputField: {
    alignSelf: "center",
    flex: 1,
    marginBottom: 50,
    gap: 5,
    justifyContent: "center",
    alignItems: "center",

    width: "100%",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "100%",
    borderBottomColor: "#adadad",
    borderBottomWidth: 1,
    paddingHorizontal: 2,
    paddingVertical: 5,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "100%",
    borderBottomColor: "#2f2d51",
    borderBottomWidth: 1,
    paddingHorizontal: 2,
    paddingVertical: 5,
  },
  logoutDark: {
    alignSelf: "flex-end",
    backgroundColor: "#212121",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logout: {
    alignSelf: "flex-end",
    backgroundColor: "#2f2d51",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 5,
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
