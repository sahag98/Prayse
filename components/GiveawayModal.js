import {
  Modal,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ModalContainer, ModalView, ModalView2 } from "../styles/appStyles";
import {
  Entypo,
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";

const GiveawayModal = ({
  isShowingGiveaway,
  setIsShowingGiveaway,
  theme,
  appstreak,
  streak,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (email.length === 0) {
      setError("An email address is required. Try again");
      return;
    }
    console.log("submitting");
    setIsShowingGiveaway(false);
  }
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isShowingGiveaway}
      onRequestClose={() => setIsShowingGiveaway(false)}
      statusBarTranslucent={true}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <ModalView2
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#212121",
                  width: "100%",
                  gap: 10,
                }
              : {
                  backgroundColor: "#b7d3ff",
                  width: "100%",
                  gap: 10,
                }
          }
        >
          <AntDesign
            onPress={() => setIsShowingGiveaway(false)}
            style={{ position: "absolute", right: 8, top: 8 }}
            name="close"
            size={22}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter-Bold",
              fontSize: 17,
              color: theme == "dark" ? "white" : "#2f2d51",
            }}
          >
            You have reached 30 days!
          </Text>
          <Text
            style={{
              fontFamily: "Inter-Medium",

              color: theme == "dark" ? "white" : "#2f2d51",
            }}
          >
            Enter your email for a chance to win a prayse merch item of your
            choice.
          </Text>
          <TextInput
            onChangeText={(text) => setEmail(text)}
            autoCapitalize="none"
            placeholderTextColor={theme == "dark" ? "#d6d6d6" : "grey"}
            value={email}
            blurOnSubmit={true}
            style={
              theme == "dark"
                ? {
                    color: "white",
                    // width: "100%",
                    backgroundColor: "#121212",
                    padding: 8,
                    borderRadius: 10,
                    fontFamily: "Inter-Regular",
                  }
                : {
                    color: "#2f2d51",
                    width: "100%",
                    backgroundColor: "white",
                    padding: 8,
                    borderRadius: 10,
                    fontFamily: "Inter-Regular",
                  }
            }
            placeholder="Enter email"
          />
          {error && (
            <Text
              style={{
                color: "red",
                fontFamily: "Inter-Regular",
                fontSize: 13,
              }}
            >
              {error}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              width: "100%",
              backgroundColor: theme == "dark" ? "#a5c9ff" : "#2f2d51",
              padding: 12,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "#121212" : "white",
                fontFamily: "Inter-Bold",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </ModalView2>
      </ModalContainer>
    </Modal>
  );
};

export default GiveawayModal;

const styles = StyleSheet.create({});
