// @ts-nocheck
import React from "react";
import { nativeApplicationVersion } from "expo-application";
import {
  Linking,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSupabase } from "@context/useSupabase";
import {
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "@types/reduxTypes";
import { supabase } from "@lib/supabase";

interface UpdateModalProps {
  theme: string;
  actualTheme: ActualTheme;
}
export const UpdateModal: React.FC<UpdateModalProps> = ({
  theme,
  actualTheme,
}) => {
  const [hasUpdate, setHasUpdate] = React.useState(false);

  async function fetchUpdate() {
    console.log("fetchUpdate");
    try {
      const { data: update } = await supabase
        .from("update")
        .select("isUpdateAvailable");
      console.log("update", update);

      if (!update.length) {
        return;
      }

      if (update[0].isUpdateAvailable !== nativeApplicationVersion.toString()) {
        setHasUpdate(true);
      } else {
        setHasUpdate(false);
      }
    } catch (error) {
      console.log("fetchUpdate", error);
    }
  }

  React.useEffect(() => {
    fetchUpdate();
  }, []);

  const handleCloseModal = () => {
    setHasUpdate(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={hasUpdate}
      onRequestClose={handleCloseModal}
      statusBarTranslucent
    >
      <View
        className="flex-1 items-center justify-center"
        style={
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary p-4 rounded-xl dark:bg-dark-secondary w-10/12"
        >
          <View className="gap-2 items-center">
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
            >
              New Update ✅
            </Text>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="dark:text-white text-light-primary mt-1 text-center font-inter-regular"
            >
              Update your app to the latest version and check out our newly
              added features.
            </Text>
          </View>
          <View className="mt-4 items-center justify-between">
            <TouchableOpacity
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              onPress={() => {
                if (Platform.OS === "android") {
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp"
                  );
                }
                if (Platform.OS === "ios") {
                  Linking.openURL(
                    "https://apps.apple.com/us/app/prayse-prayer-journal/id6443480347"
                  );
                }
              }}
              className="dark:bg-dark-accent bg-light-primary justify-center items-center w-full p-3 rounded-lg"
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="dark:text-dark-secondary text-white text-lg font-inter-bold"
              >
                Update Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="mt-2" onPress={handleCloseModal}>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="underline underline-offset-4 p-2 font-inter-medium dark:text-white text-light-primary"
              >
                Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
