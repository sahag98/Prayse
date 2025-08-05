import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { useSupabase } from "@context/useSupabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getMainBackgroundColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
// import * as StoreReview from "expo-store-review";
const WriteFeedbackModal = ({
  feedbackVisible,
  setFeedbackVisible,
  actualTheme,
  theme,
}: any) => {
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [name, setName] = useState("");

  const { supabase }: any = useSupabase();

  async function sendFeedback() {
    if (feedback.length === 0) {
      setFeedbackError("Feedback field can't be empty.");
      return;
    }
    const { error } = await supabase
      .from("feedback")
      .insert([{ name, message: feedback }]);

    if (!error) {
      Toast.show({
        type: "success",
        text1: "Your feedback was sent successfully.",
        visibilityTime: 3000,
      });
      setFeedbackVisible(false);
      setFeedbackError("");
      setName("");
      setFeedback("");
    } else {
      setFeedbackError("Something went wrong. Try again.");
    }
  }

  return (
    <Modal visible={feedbackVisible} animationType="fade" transparent>
      <View
        style={
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.4)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.4)" }
        }
      >
        <KeyboardAvoidingView
          className="w-full justify-center items-center"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg w-4/5"
          >
            <TouchableOpacity
              onPress={() => setFeedbackVisible(false)}
              className="absolute right-2 top-2 p-2 z-10"
            >
              <AntDesign
                name="close"
                size={26}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : theme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>

            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="text-2xl text-light-primary dark:text-dark-primary font-inter-bold text-center mb-3"
            >
              Feedback
            </Text>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="text-center text-light-primary dark:text-dark-primary font-inter-regular mb-3"
            >
              We value your feedback. How can we improve our app?
            </Text>
            <View className="gap-3">
              <View className="gap-2">
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-medium text-light-primary dark:text-dark-primary"
                >
                  Your name (Optional)
                </Text>
                <TextInput
                  style={[
                    getSecondaryTextColorStyle(actualTheme),
                    getMainBackgroundColorStyle(actualTheme),
                  ]}
                  numberOfLines={1}
                  className="dark:bg-dark-background font-inter-regular bg-light-background p-3 text-light-primary dark:text-dark-primary rounded-lg"
                  value={name}
                  selectionColor={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : theme === "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                  onChangeText={setName}
                />
              </View>
              <View className="gap-2">
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-medium text-light-primary dark:text-dark-primary"
                >
                  Your feedback
                </Text>
                <TextInput
                  style={[
                    getSecondaryTextColorStyle(actualTheme),
                    getMainBackgroundColorStyle(actualTheme),
                  ]}
                  selectionColor={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : theme === "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                  className="dark:bg-dark-background bg-light-background text-start font-inter-regular text-light-primary dark:text-dark-primary p-3 rounded-lg"
                  value={feedback}
                  onChangeText={setFeedback}
                  onSubmitEditing={(e: any) => {
                    e.key === "Enter" && e.preventDefault();
                  }}
                  multiline
                />
                {feedbackError.length > 0 && (
                  <Text className="text-red-500 font-inter-medium">
                    {feedbackError}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={sendFeedback}
                style={getPrimaryBackgroundColorStyle(actualTheme)}
                className="w-full mt-2 p-4 justify-center items-center bg-light-primary dark:bg-dark-accent rounded-lg"
              >
                <Text
                  style={getPrimaryTextColorStyle(actualTheme)}
                  className="font-inter-bold text-light-background dark:text-dark-background"
                >
                  Send Feedback
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default WriteFeedbackModal;
