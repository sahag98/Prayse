import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { AntDesign } from "@expo/vector-icons";

import {
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
} from "@lib/customStyles";

const CreateGroupModal = ({
  actualTheme,
  modalVisible,
  getUserGroups,
  getGroupUsers,
  supabase,
  setModalVisible,
  user,
  theme,
}) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const insets = useSafeAreaInsets();
  const handleCloseModal = () => {
    setModalVisible(false);
    setGroupName("");
    setGroupDescription("");
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const createGroup = async () => {
    if (groupName.length <= 0) {
      showToast("error", "The group name field can't be empty.");
      setModalVisible(false);
    } else {
      //prayers for production
      //prayers_test for testing
      const pin = Math.floor(Math.random() * 900000) + 100000;
      const { error } = await supabase.from("groups").insert({
        name: groupName,
        description: groupDescription ?? "",
        color: "grey",
        admin_id: user.id,
        code: pin,
      });
      if (error) {
        showToast("error", "Something went wrong. Try again.");
      }

      const { data: insertedData } = await supabase
        .from("groups")
        .select("id")
        .eq("code", pin)
        .single();

      if (insertedData) {
        const insertedGroupId = insertedData.id;
        const { data, error } = await supabase.from("members").insert({
          group_id: insertedGroupId,
          user_id: user.id,
          is_admin: true,
        });
      }
      showToast("success", "Prayer group was created successfully.");
      getUserGroups();
      getGroupUsers();
      setModalVisible(false);
      setGroupName("");
      setGroupDescription("");
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={modalVisible}
      onRequestClose={handleCloseModal}
    >
      <View
        className="bg-light-background dark:bg-dark-background items-center"
        style={
          actualTheme && actualTheme.Bg
            ? {
                backgroundColor: actualTheme.Bg,
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
        <View className="flex-row w-full justify-between">
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
          <TouchableOpacity
            disabled={groupName.length === 0}
            className="flex-row justify-center bg-light-primary dark:bg-dark-accent items-center py-3 px-4 rounded-lg"
            style={[
              getPrimaryBackgroundColorStyle(actualTheme),
              {
                opacity: groupName.length === 0 ? 0.3 : 1,
              },
            ]}
            onPress={createGroup}
          >
            <Text
              style={getPrimaryTextColorStyle(actualTheme)}
              className="font-inter-bold text-light-background dark:text-dark-background text-lg"
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-bold mt-5 text-2xl text-light-primary dark:text-dark-primary"
        >
          Create Prayer Group
        </Text>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter mt-2 font-medium text-light-primary mb-2 dark:text-dark-primary"
        >
          Create a group to have a prayer list for your group.
        </Text>
        <View className="mt-3 gap-2 justify-center items-center my-3 w-full">
          <TextInput
            style={[
              getMainTextColorStyle(actualTheme),
              actualTheme &&
                actualTheme.MainTxt && { borderColor: actualTheme.MainTxt },
            ]}
            className="border border-light-primary text-light-primary dark:text-dark-primary font-inter font-medium  dark:border-dark-primary w-full p-4 rounded-md"
            autoFocus={false}
            placeholder="Group name here"
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
            value={groupName}
            onChangeText={(text) => setGroupName(text)}
          />
          <TextInput
            style={[
              getMainTextColorStyle(actualTheme),
              actualTheme &&
                actualTheme.MainTxt && { borderColor: actualTheme.MainTxt },
            ]}
            className="border border-light-primary font-inter-medium text-light-primary dark:text-dark-primary dark:border-dark-primary w-full p-4 rounded-md"
            autoFocus={false}
            placeholder="Group description here (Optional)"
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
            value={groupDescription}
            onChangeText={(text) => setGroupDescription(text)}
          />

          <View className="mt-3 w-full">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-medium text-sm text-light-primary dark:text-[#efefef]"
            >
              "Iron sharpeneth iron; so a man sharpeneth the countenance of his
              friend."
            </Text>
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-semibold self-end text-light-primary dark:text-dark-primary"
            >
              - Proverbs 27:17
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CreateGroupModal;
