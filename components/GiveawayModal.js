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

const GiveawayModal = ({ isShowingGiveaway, theme, streak }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { supabase } = useSupabase();

  const dispatch = useDispatch();
  async function handleSubmit() {
    if (email.length === 0) {
      setError("An email address is required. Try again");
      return;
    } else {
      const { data, error } = await supabase
        .from("giveaway_entries")
        .insert([{ email, streak: streak }])
        .select();

      // console.log("data: ", data);

      console.log("giveaway error: ", error);

      if (data && data[0]?.email) {
        setError("");
        setSuccess(
          "You have entered the giveaway! Be on the lookout for an email from prayse.app@gmail.com for further details."
        );
      }

      if (error && error?.message?.includes("duplicate")) {
        setSuccess("");
        setError("You have already entered the giveaway.");
      }
    }
  }

  function closeModal() {
    dispatch(resetGiveaway());
    setError("");
    setSuccess("");
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
              onPress={closeModal}
              style={{ position: "absolute", right: 8, top: 8 }}
              name="close"
              size={22}
              color={theme === "dark" ? "white" : "#2f2d51"}
            />
            <Text
              style={{
                textAlign: "center",
                fontFamily: "Inter-Bold",
                fontSize: 18,
                color: theme === "dark" ? "white" : "#2f2d51",
              }}
            >
              Great job!
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",
                fontSize: 15,
                color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
              }}
            >
              You have done the daily devotions for 60 straight days.
            </Text>
            <Text
              style={{
                fontFamily: "Inter-Medium",

                color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
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
            {success && (
              <Text
                style={{
                  color: "#008900",
                  fontFamily: "Inter-Medium",
                  fontSize: 13,
                }}
              >
                {success}
              </Text>
            )}
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
            {success ? (
              <TouchableOpacity
                onPress={closeModal}
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
                  Okay
                </Text>
              </TouchableOpacity>
            ) : (
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
            )}
          </ModalView2>
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default GiveawayModal;
