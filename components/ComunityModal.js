import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Modal } from "react-native";
import { PRAYSE_MESSAGE, PRAYSE_TEST_MESSAGE } from "@env";
import { AntDesign } from "@expo/vector-icons";

import { ModalContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native";
import { Switch } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CommunityModal = ({
  modalVisible,
  getPrayers,
  getUserPrayers,
  supabase,
  setModalVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [prayer, setPrayer] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const [isEnabled, setIsEnabled] = useState(false);
  const insets = useSafeAreaInsets();

  const handleCloseModal = () => {
    setModalVisible(false);
    setPrayer("");
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

  const addPrayer = async () => {
    console.log("adding prayer");
    function truncateWords(str, numWords) {
      let words = str.split(" ");
      if (words.length > numWords) {
        return words.slice(0, numWords).join(" ") + " ...";
      } else {
        return str;
      }
    }

    let truncatedString = truncateWords(prayer, 5);

    console.log(truncatedString);
    if (prayer.length <= 0) {
      showToast("error", "The prayer field can't be left empty.");
      setModalVisible(false);
      return;
    } else {
      //prayers for production
      //prayers_test for testing
      const { data, error } = await supabase.from("prayers").insert({
        prayer: prayer,
        user_id: user?.id,
        disable_response: isEnabled,
      });
      showToast("success", "Prayer posted successfully.🙏🏼");
      const message = {
        title: "Community 🌐",
        message: `${user?.full_name} has posted a prayer: ${truncatedString} .Click here to pray for their request.`,
        data: { screen: "PublicCommunity", public: true, verseTitle: "" },
      };

      fetch(PRAYSE_TEST_MESSAGE.toString(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if (error) {
        showToast("error", "Something went wrong. Try again.");
      }
      getPrayers();
      getUserPrayers();
      setModalVisible(false);
      setIsEnabled(false);
      setPrayer("");
    }
  };

  return (
    // <SafeAreaProvider>
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
                alignItems: "flex-start",
                paddingTop: Platform.OS == "ios" ? insets.top : 0,
                paddingBottom: Platform.OS == "ios" ? insets.bottom : 0,
              }
            : {
                backgroundColor: "#F2F7FF",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingTop: Platform.OS == "ios" ? insets.top : 0,
                paddingBottom: Platform.OS == "ios" ? insets.bottom : 0,
              }
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={handleCloseModal}
          >
            <AntDesign
              name="left"
              size={30}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "white",
                      fontSize: 20,
                      marginLeft: 10,
                      fontFamily: "Inter-Bold",
                    }
                  : {
                      color: "#2f2d51",
                      fontSize: 20,
                      marginLeft: 10,
                      fontFamily: "Inter-Bold",
                    }
              }
            >
              Prayer Post
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={prayer.length == 0 ? true : false}
            onPress={addPrayer}
            style={
              theme == "dark"
                ? {
                    backgroundColor: prayer.length == 0 ? "#212121" : "#A5C9FF",

                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }
                : {
                    backgroundColor:
                      prayer.length == 0 ? "lightgrey" : "#2f2d51",

                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }
            }
          >
            <Text
              style={
                theme == "dark"
                  ? {
                      color: prayer.length == 0 ? "grey" : "#121212",
                      fontFamily: "Inter-Bold",
                    }
                  : { color: "white", fontFamily: "Inter-Bold" }
              }
            >
              Post Prayer
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputField}>
          <Text
            style={
              theme == "dark"
                ? { color: "white", fontSize: 18, fontFamily: "Inter-Bold" }
                : { color: "#2f2d51", fontSize: 18, fontFamily: "Inter-Bold" }
            }
          >
            Prayer
          </Text>
          <TextInput
            style={theme == "dark" ? styles.inputDark : styles.input}
            autoFocus={modalVisible}
            placeholder="Add a prayer"
            placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
            selectionColor={theme == "dark" ? "white" : "#2f2d51"}
            value={prayer}
            onChangeText={(text) => setPrayer(text)}
            onContentSizeChange={handleContentSizeChange}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            multiline={true}
          />
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
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text
            style={
              theme == "dark"
                ? { color: "white", fontFamily: "Inter-Medium", fontSize: 16 }
                : {
                    color: "#2f2d51",
                    fontFamily: "Inter-Medium",
                    fontSize: 16,
                  }
            }
          >
            Turn off responses
          </Text>
          <Switch
            trackColor={{ false: "grey", true: "grey" }}
            thumbColor={isEnabled ? "green" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </ModalContainer>
    </Modal>
    // </SafeAreaProvider>
  );
};

export default CommunityModal;

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
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "100%",
    borderBottomColor: "#2f2d51",
    borderBottomWidth: 1,
    paddingHorizontal: 2,
    paddingVertical: 10,
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
