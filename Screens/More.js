import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import {
  Container,
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  ModalView2,
  StyledInput,
} from "../styles/appStyles";
import { useSelector } from "react-redux";
import {
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { firebase } from "../firebase";
import { Platform } from "react-native";
import { IOS_ITEM_ID, ANDROID_PACKAGE_NAME } from "@env";
import { Linking } from "react-native";

import SettingsItems from "../components/SettingsItems";
import { Button, Snackbar } from "react-native-paper";

const More = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const theme = useSelector((state) => state.user.theme);

  const [selectedOption, setSelectedOption] = useState([]);
  const [addedSuggestion, setAddedSuggestion] = useState("");
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [snackbarvisible, setSnackbarVisible] = useState(false);

  const suggestions = [
    "- User based community page: Create a user and reply to prayers and more.",
    "- Quick prayer: Add a quick prayer by just a press of a button.",
    "- Reflection on Devotional: Ability to write down thoughts on devotional page.",
    "- All of the Above",
  ];

  function giveFeedback(market) {
    if (market == "android") {
      Linking.openURL(
        `market://details?id=${ANDROID_PACKAGE_NAME}&showAllReviews=true`
      );
    }
    if (market == "ios") {
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${IOS_ITEM_ID}?action=write-review`
      );
    }
  }

  const handleVote = () => {
    if (selectedOption) {
      // Store the vote in Firestore
      firebase
        .firestore()
        .collection("votes")
        .add({
          suggestion: selectedOption,
        })
        .then(() => {
          console.log("Vote added successfully!");
          setSnackbarVisible(true);
          setSelectedOption("");
          setAddedSuggestion("");
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error adding vote: ", error);
        });
    }

    if (addedSuggestion) {
      firebase
        .firestore()
        .collection("votes")
        .add({
          suggestion: addedSuggestion,
        })
        .then(() => {
          setSnackbarVisible(true);

          setAddedSuggestion("");
          setSelectedOption("");
          setOpen(false);
        })
        .catch((error) => {
          console.error("Error adding vote: ", error);
        });
    }
  };

  const handleOptionPress = (option) => {
    setSelectedOption((prevArray) => [...prevArray, option]);
    setSubmitDisabled(false);
  };

  const handleInputChange = (text) => {
    setAddedSuggestion(text);
    setSubmitDisabled(false);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedOption([]);
  };

  const options = [
    {
      id: 1,
      icon: (
        <Ionicons
          name="book-outline"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Verse of the Day",
      screen: "VerseOfTheDay",
    },

    {
      id: 2,
      icon: (
        <AntDesign
          name="infocirlceo"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "About",
      link: "https://prayse-website.vercel.app/",
    },
    {
      id: 3,
      icon: (
        <AntDesign
          name="setting"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Settings",
      screen: "Settings",
    },
    {
      id: 4,
      icon: (
        <Feather
          name="shield"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Privacy Policy",
      link: "https://www.privacypolicies.com/live/887580d1-6bf3-4b0a-a716-a732bf8141fa",
    },
    {
      id: 5,
      icon: (
        <MaterialCommunityIcons
          name="email-edit-outline"
          style={{ marginRight: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      ),
      title: "Contact Developer",
      link: "mailto:arzsahag@gmail.com",
    },
  ];

  let [fontsLoaded] = useFonts({
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  });

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }

  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <HeaderTitle
        style={
          theme == "dark"
            ? { fontFamily: "Inter-Bold", color: "white", marginVertical: 10 }
            : { fontFamily: "Inter-Bold", color: "#2F2D51", marginVertical: 10 }
        }
      >
        More
      </HeaderTitle>
      <SettingsItems options={options} theme={theme} navigation={navigation} />
      {Platform.OS === "ios" ? (
        <TouchableOpacity
          onPress={() => giveFeedback("ios")}
          style={theme == "dark" ? styles.verseDark : styles.verse}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="feedback"
              size={24}
              style={{ marginRight: 10 }}
              color="white"
            />
            <Text
              style={{
                fontFamily: "Inter-Medium",
                color: "white",
                fontSize: 16,
              }}
            >
              Feedback
            </Text>
          </View>
          <AntDesign
            style={{ marginLeft: 10 }}
            name="right"
            size={14}
            color={theme == "dark" ? "white" : "white"}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => giveFeedback("android")}
          style={theme == "dark" ? styles.verseDark : styles.verse}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="feedback"
              size={24}
              style={{ marginRight: 10 }}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
            <Text
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Medium", color: "white", fontSize: 16 }
                  : {
                      fontFamily: "Inter-Medium",
                      color: "#2f2d51",
                      fontSize: 16,
                    }
              }
            >
              Feedback
            </Text>
          </View>
          <AntDesign
            style={{ marginLeft: 10 }}
            name="right"
            size={14}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={theme == "dark" ? styles.verseDark : styles.verse}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={
              theme == "dark"
                ? { fontFamily: "Inter-Medium", color: "white", fontSize: 16 }
                : { fontFamily: "Inter-Medium", color: "#2f2d51", fontSize: 16 }
            }
          >
            Next Update Suggestions
          </Text>
        </View>
        <MaterialCommunityIcons
          name="thought-bubble-outline"
          style={{ marginLeft: 10 }}
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={handleCloseModal}
        statusBarTranslucent={true}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
        >
          <ModalContainer
            style={
              theme == "dark"
                ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
                : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            }
          >
            <ModalView2
              style={
                theme == "dark"
                  ? { backgroundColor: "#212121" }
                  : { backgroundColor: "#93D8F8" }
              }
            >
              <TouchableOpacity
                onPress={handleCloseModal}
                style={{ position: "absolute", right: 10, top: 10 }}
              >
                <AntDesign
                  name="close"
                  size={28}
                  color={theme == "dark" ? "white" : "#2f2d51"}
                />
              </TouchableOpacity>

              <HeaderTitle
                style={
                  theme == "dark"
                    ? {
                        textAlign: "center",
                        fontFamily: "Inter-Bold",
                        color: "white",
                      }
                    : { textAlign: "center", fontFamily: "Inter-Bold" }
                }
              >
                Next Update Suggestions
              </HeaderTitle>
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "white",
                        textAlign: "center",
                        fontFamily: "Inter-Regular",
                        marginVertical: 5,
                      }
                    : {
                        color: "#2f2d51",
                        textAlign: "center",
                        marginVertical: 5,
                        fontFamily: "Inter-Regular",
                      }
                }
              >
                Select an option or enter a suggestion:
              </Text>
              {suggestions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleOptionPress(option)}
                  style={
                    theme == "dark"
                      ? {
                          padding: 10,
                          borderRadius: 10,
                          backgroundColor: selectedOption.includes(option)
                            ? "#121212"
                            : "transparent",
                        }
                      : {
                          padding: 10,
                          borderRadius: 10,
                          backgroundColor: selectedOption.includes(option)
                            ? "#4bbef3"
                            : "transparent",
                        }
                  }
                >
                  <Text
                    style={
                      theme == "dark"
                        ? { color: "#e0e0e0", fontFamily: "Inter-Medium" }
                        : { color: "#2f2d51", fontFamily: "Inter-Medium" }
                    }
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
              <TextInput
                style={theme == "dark" ? styles.inputDark : styles.input}
                placeholder="enter suggestion"
                value={addedSuggestion}
                placeholderTextColor={theme == "dark" ? "#aaaaaa" : "#2f2d51"}
                selectionColor={theme == "dark" ? "white" : "#2f2d51"}
                onChangeText={handleInputChange}
              />
              <TouchableOpacity
                style={
                  theme == "dark"
                    ? {
                        backgroundColor: "#121212",
                        paddingVertical: 15,
                        borderRadius: 10,
                        alignItems: "center",
                      }
                    : {
                        backgroundColor: "#2f2d51",
                        paddingVertical: 15,
                        borderRadius: 10,
                        alignItems: "center",
                      }
                }
                onPress={handleVote}
                disabled={submitDisabled}
              >
                <Text style={{ color: "white", fontFamily: "Inter-Bold" }}>
                  Submit Vote
                </Text>
              </TouchableOpacity>
            </ModalView2>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
      <Snackbar
        style={
          theme == "dark"
            ? { backgroundColor: "#212121" }
            : { backgroundColor: "#2f2d51" }
        }
        visible={snackbarvisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={5000}
      >
        Thank you for submitting a suggestion!
      </Snackbar>
    </Container>
  );
};

export default More;

const styles = StyleSheet.create({
  inputDark: {
    borderRadius: 10,
    padding: 8,
    color: "white",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#353535",
    marginBottom: 12,
  },
  input: {
    borderRadius: 10,
    padding: 8,
    color: "#2f2d51",
    borderColor: "black",
    fontFamily: "Inter-Regular",
    marginBottom: 12,
    backgroundColor: "#4bbef3",
  },
  verseDark: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#212121",
    padding: 20,
    borderRadius: 20,
    justifyContent: "space-between",
    marginBottom: 15,
  },
  verse: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#b8e5fa",
    padding: 20,
    borderRadius: 20,
    justifyContent: "space-between",
    marginBottom: 15,
  },
});
