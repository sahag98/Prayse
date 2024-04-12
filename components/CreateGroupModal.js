import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import groupBg from "../assets/group-bg.png";
import { HeaderView, ModalContainer } from "../styles/appStyles";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import TemplatesModal from "./TemplatesModal";

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
  const [groupImage, setGroupImage] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [isShowingTemplates, setIsShowingTemplates] = useState(false);
  const insets = useSafeAreaInsets();
  const handleCloseModal = () => {
    setModalVisible(false);
    setGroupName("");
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
      console.log(imgUrl);
      const { data, error } = await supabase.from("groups").insert({
        name: groupName,
        color: "grey",
        admin_id: user.id,
        code: pin,
        group_img: imgUrl,
      });
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
      }
      showToast("success", "Prayer group was created successfully.");
      getUserGroups();
      getGroupUsers();
      setModalVisible(false);
      setGroupName("");
      setGroupImage(null);
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
      setGroupImage(result.assets[0].uri);
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

      // const { data, error } = await supabase
      //   .from("groups")
      //   .update({
      //     avatar_url: imageData.signedUrl,
      //   })
      //   .eq("id", user.id);

      if (error) {
        throw error;
      }
      // getProfile();
      // getPrayers();
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
                  paddingTop: insets.top,
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
            <TouchableOpacity
              disabled={groupName.length == 0 ? true : false}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor:
                  theme == "dark"
                    ? groupName.length == 0
                      ? "#212121"
                      : "#a5c9ff"
                    : groupName.length == 0
                    ? "grey"
                    : "#2f2d51",
                padding: 8,
                borderRadius: 20,
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
                        fontSize: 16,
                        color: groupName.length == 0 ? "grey" : "#121212",
                      }
                    : {
                        fontFamily: "Inter-Bold",
                        fontSize: 16,
                        color: groupName.length == 0 ? "white" : "white",
                      }
                }
              >
                Create
              </Text>
            </TouchableOpacity>
          </HeaderView>

          <View style={styles.iconContainer}>
            <Image
              style={[
                styles.profileImg,
                {
                  backgroundColor: groupImage
                    ? null
                    : theme == "dark"
                    ? "grey"
                    : "#deebff",
                },
              ]}
              source={
                groupImage
                  ? {
                      uri: groupImage,
                    }
                  : groupBg
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
                onPress={() => setIsShowingTemplates(true)}
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
                <TemplatesModal
                  theme={theme}
                  setIsShowingTemplates={setIsShowingTemplates}
                  isShowingTemplates={isShowingTemplates}
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

          <View style={styles.inputField}>
            <TextInput
              style={theme == "dark" ? styles.nameDark : styles.name}
              autoFocus={false}
              placeholder="Prayer group name"
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
              selectionColor={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
              value={groupName}
              onChangeText={(text) => setGroupName(text)}
            />

            <View style={{ width: "100%" }}>
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
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  iconContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  nameDark: {
    backgroundColor: "#212121",
    color: "white",
    borderRadius: 10,
    padding: 15,
    width: "100%",
  },
  name: {
    color: "#2f2d51",
    backgroundColor: "#deebff",
    borderRadius: 10,
    padding: 15,
    width: "100%",
  },
  inputField: {
    marginTop: 20,
    gap: 10,
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
