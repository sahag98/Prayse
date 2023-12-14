import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Modal } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { HeaderTitle, HeaderView, ModalContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native";
import { Switch } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const CreateGroupModal = ({
  modalVisible,
  getUserGroups,
  getGroupUsers,
  supabase,
  setModalVisible,
  user,
  theme,
}) => {
  const [groupName, setGroupName] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const [isEnabled, setIsEnabled] = useState(false);
  const insets = useSafeAreaInsets();
  const handleCloseModal = () => {
    setModalVisible(false);
    setGroupName("");
  };

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
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
      return;
    } else {
      //prayers for production
      //prayers_test for testing
      const pin = Math.floor(Math.random() * 900000) + 100000;

      const { data, error } = await supabase.from("groups").insert({
        name: groupName,
        description: description,
        color: color,
        code: pin,
      });

      // generateGroupMembers()
      if (error) {
        showToast("error", "Something went wrong. Try again.");
      }

      const { data: insertedData, error: fetchError } = await supabase
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
        // Do something with the inserted group ID
      }
      getUserGroups();
      getGroupUsers();
      setModalVisible(false);
      setIsEnabled(false);
      setGroupName("");
      setDescription("");
      setColor("");
    }
  };

  const photoPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast(
          "error",
          "We need camera roll permissions to make this work!"
        );
      } else {
        pickImage();
      }
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const ext = result.assets[0].uri.substring(
        result.assets[0].uri.lastIndexOf(".") + 1
      );

      const fileName = result.assets[0].uri.replace(/^.*[\\\/]/, "");

      const filePath = `${fileName}`;
      const formData = new FormData();
      formData.append("files", {
        uri: result.assets[0].uri,
        name: fileName,
        type: result.assets[0].type ? `image/${ext}` : `video/${ext}`,
      });

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, formData);

      if (uploadError) {
        throw uploadError;
      }

      const { data: imageData, error: getUrlError } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry

      if (getUrlError) {
        throw getUrlError;
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          avatar_url: imageData.signedUrl,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }
      getProfile();
      getPrayers();
    }
  };

  // const generateGroupMembers=async ()=>{
  //   const { data, error } = await supabase.from("groups").select()
  // }

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
                  paddingTop: insets.top,
                  paddingBottom: insets.bottom,
                }
              : {
                  backgroundColor: "#F2F7FF",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingTop: insets.top,
                  paddingBottom: insets.bottom,
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
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
              onPress={createGroup}
            >
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        fontSize: 18,
                        color: "#a5c9ff",
                      }
                    : {
                        fontFamily: "Inter-Bold",
                        fontSize: 18,
                        color: "#2f2d51",
                      }
                }
              >
                Create
              </Text>
              <AntDesign
                name="plus"
                size={28}
                color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
              />
            </TouchableOpacity>
          </HeaderView>

          <View style={styles.inputField}>
            <TextInput
              style={theme == "dark" ? styles.nameDark : styles.name}
              autoFocus={modalVisible}
              placeholder="Prayer group name"
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
              selectionColor={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
              value={groupName}
              onChangeText={(text) => setGroupName(text)}
            />
            <View style={{ width: "100%", marginTop: 10, gap: 10 }}>
              <TextInput
                style={theme == "dark" ? styles.inputDark : styles.input}
                placeholder="Enter group description"
                placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
                selectionColor={theme == "dark" ? "white" : "#2f2d51"}
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
              <TextInput
                style={theme == "dark" ? styles.inputDark : styles.input}
                placeholder="Enter icon border color: (optional)"
                placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
                selectionColor={theme == "dark" ? "white" : "#2f2d51"}
                value={color}
                onChangeText={(text) => setColor(text)}
              />
            </View>
            <TouchableOpacity
              style={{ alignSelf: "flex-end", marginTop: 5 }}
              onPress={() => Keyboard.dismiss()}
            >
              <Text
                style={
                  theme == "dark"
                    ? {
                        marginTop: 5,
                        color: "#ff6262",
                        fontFamily: "Inter-Regular",
                        fontSize: 13,
                      }
                    : {
                        marginTop: 5,
                        color: "#ff6262",
                        fontFamily: "Inter-Regular",
                        fontSize: 13,
                      }
                }
              >
                Dismiss Keyboard
              </Text>
            </TouchableOpacity>
            <View style={{ marginTop: 10, width: "100%" }}>
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#efefef",
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
                "Iron sharpeneth iron; so a man sharpeneth the countenance of
                his friend."
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
                - Proverbs 27:17
              </Text>
            </View>
          </View>
        </ModalContainer>
      </Modal>
    </SafeAreaProvider>
  );
};

export default CreateGroupModal;

const styles = StyleSheet.create({
  nameDark: {
    backgroundColor: "#212121",
    color: "white",
    borderRadius: 10,
    padding: 15,
  },
  name: {
    color: "#2f2d51",
    backgroundColor: "#deebff",
    borderRadius: 10,
    padding: 15,
  },
  inputField: {
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
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
    borderBottomColor: "#b7d3ff",
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
