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
import { HeaderTitle, ModalContainer, ModalView2 } from "../styles/appStyles";

const GiveawayModal = ({ isShowingGiveaway, theme, streak }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { supabase } = useSupabase();

  const dispatch = useDispatch();
  async function handleSubmit() {
    if (email.length === 0 || !email.includes("@")) {
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
            <HeaderTitle
              style={
                theme === "dark"
                  ? {
                      fontFamily: "Inter-Bold",
                      textAlign: "center",
                      letterSpacing: 1,
                      color: "white",
                    }
                  : {
                      fontFamily: "Inter-Bold",
                      textAlign: "center",
                      color: "#2f2d51",
                      letterSpacing: 1,
                    }
              }
            >
              Great Job!
            </HeaderTitle>
            <Text className="font-inter font-medium text-lg dark:text-[#d2d2d2] text-light-primary">
              You have done the daily devotions for 60 days straight.
            </Text>
            <Text className="font-inter font-medium dark:text-[#d2d2d2] text-light-primary">
              Enter your email for a chance to win a prayse merch item of your
              choice.
            </Text>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              autoCapitalize="none"
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "grey"}
              value={email}
              blurOnSubmit
              className="dark:text-white text-light-primary dark:bg-dark-background p-3 rounded-lg font-inter font-normal"
              placeholder="Enter email"
            />
            {success && (
              <Text className="text-[#008900] font-inter font-medium text-sm">
                {success}
              </Text>
            )}
            {error && (
              <Text className="text-red-600 font-inter font-normal text-sm">
                {error}
              </Text>
            )}
            {success ? (
              <TouchableOpacity
                onPress={closeModal}
                className="w-full dark:bg-dark-accent bg-light-primary p-3 rounded-lg justify-center  items-center"
              >
                <Text className="font-inter font-bold dark:text-dark-background text-white">
                  Okay
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleSubmit}
                className="w-full dark:bg-dark-accent bg-light-primary p-3 rounded-lg justify-center  items-center"
              >
                <Text className="font-inter font-bold dark:text-dark-background text-white">
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
