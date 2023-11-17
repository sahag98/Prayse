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

const JoinModal = ({
  modalVisible,
  getUserGroups,
  supabase,
  setModalVisible,
  user,
  theme,
}) => {
  const [code, setCode] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const [isEnabled, setIsEnabled] = useState(false);
  const insets = useSafeAreaInsets();
  const handleCloseModal = () => {
    setModalVisible(false);
    setCode("");
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
      console.log(group);
      if (group.length == 0) {
        alert("Group doesnt exist");
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
      setModalVisible(false);
      setIsEnabled(false);
      setCode("");
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
              onPress={joinGroup}
            >
              <Text
                style={
                  theme == "dark"
                    ? { fontFamily: "Inter-Medium", color: "#a5c9ff" }
                    : { fontFamily: "Inter-Medium", color: "#2f2d51" }
                }
              >
                Join
              </Text>
              <AntDesign
                name="plus"
                size={24}
                color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
              />
            </TouchableOpacity>
          </HeaderView>
          {/* <View style={styles.iconContainer}>
            <Image
              style={styles.profileImg}
              source={{
                uri: image
                  ? image
                  : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
              }}
            />
            <TouchableOpacity
              onPress={photoPermission}
              style={
                theme == "dark" ? styles.featherIconDark : styles.featherIcon
              }
            >
              <AntDesign
                name="plus"
                size={20}
                color={theme == "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View> */}
          <View style={styles.inputField}>
            {/* <Text
              style={
                theme == "dark"
                  ? { color: "white", fontSize: 16, fontFamily: "Inter-Bold" }
                  : { color: "#2f2d51", fontSize: 16, fontFamily: "Inter-Bold" }
              }
            >
              Group Name
            </Text> */}
            <TextInput
              style={theme == "dark" ? styles.nameDark : styles.name}
              autoFocus={modalVisible}
              placeholder="Enter code"
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
              selectionColor={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
              value={code}
              onChangeText={(text) => setCode(text)}
            />
            {/* <TextInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              placeholder="Enter group description"
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
            <TextInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              placeholder="Enter color hex"
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={color}
              onChangeText={(text) => setColor(text)}
            /> */}
            <TouchableOpacity onPress={() => Keyboard.dismiss()}>
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
          </View>
        </ModalContainer>
      </Modal>
    </SafeAreaProvider>
  );
};

export default JoinModal;

const styles = StyleSheet.create({
  nameDark: {
    padding: 10,
    color: "white",
    fontFamily: "Inter-Bold",
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
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
