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
import { useColorScheme } from "nativewind";
import { AntDesign } from "@expo/vector-icons";
import {
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "../types/reduxTypes";
import { useSelector } from "react-redux";
import { registerForPushNotificationsAsync } from "@app/(tabs)/folder";

interface SetNameModalProps {
  visible: boolean;
  onClose: () => void;
  supabase: any;
  userId: string;
  onNameSet: () => void;
}

export const SetNameModal: React.FC<SetNameModalProps> = ({
  visible,
  onClose,
  supabase,
  userId,
  onNameSet,
}) => {
  const [name, setName] = useState("");
  const [isUnique, setIsUnique] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme
  );

  const showToast = (type: string, content: string) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const checkIfUnique = async (nameToCheck: string) => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("full_name")
      .neq("id", userId);

    const isUniqueName = profiles.every((prof: any) => {
      const profileName = prof.full_name || "";
      return (
        nameToCheck.trim().toLowerCase() !== profileName.trim().toLowerCase()
      );
    });

    return isUniqueName;
  };

  const handleSave = async () => {
    if (name.trim().length <= 1) {
      setIsEmpty(true);
      showToast("error", "Please enter a name (at least 2 characters)");
      return;
    }

    setIsSaving(true);
    setIsEmpty(false);

    try {
      const isUniqueName = await checkIfUnique(name.trim());

      if (!isUniqueName) {
        setIsUnique(false);
        showToast(
          "error",
          "This name is already taken. Please choose another."
        );
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name.trim() })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      showToast("success", "Name saved successfully! ✔️");
      onNameSet();
      onClose();
    } catch (error: any) {
      console.error("Error saving name:", error);
      showToast("error", "Failed to save name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          className="flex-1 justify-center items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <View
            className="bg-light-secondary dark:bg-dark-secondary w-4/5 rounded-2xl p-6"
            style={getSecondaryBackgroundColorStyle(actualTheme)}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="text-2xl font-inter-bold text-light-primary dark:text-dark-primary"
                >
                  Welcome! 👋
                </Text>
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="text-base font-inter-medium mt-2 text-light-primary dark:text-dark-primary opacity-80"
                >
                  Please create a name for your profile so others can identify
                  you.
                </Text>
              </View>
            </View>

            {/* Input Field */}
            <View className="mb-4">
              <TextInput
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setIsEmpty(false);
                  setIsUnique(true);
                }}
                placeholder="Enter your name"
                placeholderTextColor={colorScheme === "dark" ? "#888" : "#666"}
                className="bg-light-background dark:bg-dark-background p-4 rounded-xl font-inter-medium text-lg text-light-primary dark:text-dark-primary"
                style={{
                  borderWidth: isEmpty || !isUnique ? 1 : 1,
                  borderColor:
                    isEmpty || !isUnique
                      ? "#ef4444"
                      : colorScheme === "dark"
                      ? "#444"
                      : "#ddd",
                  textAlignVertical: "center",
                  ...(Platform.OS === "android" && {
                    includeFontPadding: false,
                  }),
                }}
                autoFocus
                maxLength={30}
              />
              {isEmpty && (
                <Text className="text-red-500 text-sm font-inter-medium mt-1">
                  Name must be at least 2 characters
                </Text>
              )}
              {!isUnique && (
                <Text className="text-red-500 text-sm font-inter-medium mt-1">
                  This name is already taken. Please choose another.
                </Text>
              )}
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving || name.trim().length <= 1}
                style={getPrimaryBackgroundColorStyle(actualTheme)}
                className={`bg-light-primary dark:bg-dark-accent p-4 rounded-xl flex-1 items-center justify-center ${
                  isSaving || name.trim().length <= 1 ? "opacity-50" : ""
                }`}
              >
                <Text
                  style={getPrimaryTextColorStyle(actualTheme)}
                  className="font-inter-bold text-lg text-light-background dark:text-dark-background"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
