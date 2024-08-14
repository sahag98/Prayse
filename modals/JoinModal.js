import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Layout,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { AntDesign } from "@expo/vector-icons";

import { HeaderView, ModalContainer } from "../styles/appStyles";
import { getMainTextColorStyle } from "@lib/customStyles";

const JoinModal = ({
  actualTheme,
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

  const slideIn = useSharedValue(100);
  const inputExpand = useSharedValue(100);

  const slideAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideIn.value }],
    };
  });

  const inputAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${inputExpand.value}%`,
    };
  });

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

  useAnimatedReaction(
    () => code.length,
    (length) => {
      if (length === 6) {
        slideIn.value = withTiming(1, { duration: 200, easing: Easing.linear });
        inputExpand.value = withTiming(85, {
          duration: 200,
          easing: Easing.linear,
        });
      } else {
        slideIn.value = withTiming(100, {
          duration: 200,
          easing: Easing.linear,
        });
        inputExpand.value = withTiming(100, {
          duration: 200,
          easing: Easing.linear,
        });
      }
    }
  );

  const joinGroup = async () => {
    if (code.length <= 0) {
      showToast("error", "The group name field can't be empty.");
      setModalVisible(false);
    } else {
      const { data: group } = await supabase
        .from("groups")
        .select("code, id")
        .eq("code", code);

      if (group.length == 0) {
        setJoinError(true);

        setCode("");
        return;
      } else if (group.length > 0) {
        const { data: members } = await supabase
          .from("members")
          .select("*")
          .eq("group_id", group[0].id)
          .eq("user_id", user.id);

        if (members.length > 0) {
          console.log("You have already joined this group.");
        } else {
          console.log(`Joining group${group[0].code}`);
          await supabase.from("members").insert({
            group_id: group[0].id,
            user_id: user.id,
          });
          showToast("success", "Prayer group joined successfully.");
          setJoinError(false);
        }
      }
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
        transparent
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <ModalContainer
          className="bg-light-background dark:bg-dark-background items-center"
          style={
            actualTheme && actualTheme.Bg
              ? {
                  justifyContent: "flex-start",
                  backgroundColor: actualTheme.Bg,
                  paddingTop: Platform.OS === "ios" ? insets.top : 0,
                  paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
                }
              : theme === "dark"
                ? {
                    justifyContent: "flex-start",

                    paddingTop: Platform.OS === "ios" ? insets.top : 0,
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
                  }
                : {
                    justifyContent: "flex-start",

                    paddingTop: Platform.OS === "ios" ? insets.top : 0,
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
                  }
          }
        >
          <HeaderView className="flex-row w-full justify-between">
            <TouchableOpacity onPress={handleCloseModal}>
              <AntDesign
                name="left"
                size={30}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : theme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
          </HeaderView>

          <View className="flex-1 mb-14 gap-2 self-center items-center w-full justify-center">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="text-3xl mb-2 font-inter font-bold text-light-primary dark:text-dark-primary"
            >
              Join Prayer Group
            </Text>
            <View className="w-full flex-row items-center justify-between">
              <Animated.View
                className="border p-4 rounded-lg border-light-primary dark:border-dark-secondary"
                style={[
                  inputAnimatedStyle,
                  actualTheme &&
                    actualTheme.MainTxt && { borderColor: actualTheme.MainTxt },
                ]}
              >
                <TextInput
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter font-medium"
                  // autoFocus={modalVisible}
                  maxLength={6}
                  keyboardType="numeric"
                  placeholder="Enter 6 digit group code"
                  placeholderTextColor={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : theme === "dark"
                        ? "#d6d6d6"
                        : "#2f2d51"
                  }
                  selectionColor={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : theme === "dark"
                        ? "#a5c9ff"
                        : "#2f2d51"
                  }
                  value={code}
                  on
                  onChangeText={(text) => setCode(text)}
                />
              </Animated.View>
              <TouchableOpacity onPress={joinGroup}>
                <Animated.View style={[slideAnimatedStyle]}>
                  <AntDesign
                    name="rightcircle"
                    size={42}
                    color={
                      actualTheme && actualTheme.Primary
                        ? actualTheme.Primary
                        : theme === "dark"
                          ? "#a5c9ff"
                          : "#2f2d51"
                    }
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
            {joinError && (
              <Text className="font-inter self-start font-medium text-sm text-red-500">
                Group doesn't exist try again.
              </Text>
            )}

            <View className="mt-2 w-full">
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter text-sm font-medium text-light-primary dark:text-dark-primary"
              >
                "For where two or three are gathered together in my name, there
                am I in the midst of them."
              </Text>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="self-end text-light-primary dark:text-dark-primary font-inter font-semibold"
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
    width: "100%",
    padding: 15,
    borderRadius: 10,
    color: "white",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    justifyContent: "center",
    alignSelf: "center",
  },
  name: {
    width: "100%",
    padding: 15,

    color: "#2f2d51",
    borderRadius: 10,
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
