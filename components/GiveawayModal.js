import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign } from "@expo/vector-icons";

import { useSupabase } from "../context/useSupabase";
import { resetGiveaway } from "../redux/userReducer";
import { ModalContainer, ModalView2 } from "../styles/appStyles";

const GiveawayModal = ({
  isShowingGiveaway,
  setIsShowingGiveaway,
  theme,
  appstreak,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { supabase } = useSupabase();

  const dispatch = useDispatch();
  async function handleSubmit() {
    if (email.length === 0) {
      setError("An email address is required. Try again");
      return;
    } else {
      await supabase
        .from("giveaway_entries")
        .insert([{ email, streak: appstreak }])
        .select();
    }
    console.log("submitting");
    closeModal();
  }

  function closeModal() {
    dispatch(resetGiveaway());
  }
  return (
    <Modal
      animationType="fade"
      transparent
      visible={isShowingGiveaway}
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ModalContainer
          style={
            theme === "dark"
              ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
              : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
          }
        >
          <ModalView2
            style={
              theme === "dark"
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
              color={theme === "dark" ? "white" : "#2f2d51"}
            />
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Inter-Bold",
                fontSize: 17,
                color: theme === "dark" ? "white" : "#2f2d51",
              }}
            >
              You have reached 30 days!
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",

                color: theme === "dark" ? "white" : "#2f2d51",
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
              blurOnSubmit
              style={
                theme === "dark"
                  ? {
                      color: "white",
                      backgroundColor: "#121212",
                      padding: 12,
                      borderRadius: 10,
                      fontFamily: "Inter-Regular",
                    }
                  : {
                      color: "#2f2d51",
                      backgroundColor: "white",
                      padding: 12,
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
                backgroundColor: theme === "dark" ? "#a5c9ff" : "#2f2d51",
                padding: 12,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme === "dark" ? "#121212" : "white",
                  fontFamily: "Inter-Bold",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </ModalView2>
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default GiveawayModal;
