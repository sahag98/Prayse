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
  HeaderTitle,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";

interface UpdateModalProps {
  theme: string;
}
export const UpdateModal: React.FC<UpdateModalProps> = ({ theme }) => {
  const { supabase } = useSupabase();
  const [hasUpdate, setHasUpdate] = React.useState(false);

  async function fetchUpdate() {
    try {
      const { data: update } = await supabase
        .from("update")
        .select("isUpdateAvailable");

      if (!update.length) {
        return;
      }

      if (update[0].isUpdateAvailable !== nativeApplicationVersion.toString()) {
        // setHasUpdate(true);
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
      <ModalContainer
        style={
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <ModalView
          style={
            theme === "dark"
              ? { backgroundColor: "#212121", width: "85%" }
              : { backgroundColor: "#b7d3ff", width: "85%" }
          }
        >
          <ModalIcon>
            <HeaderTitle
              style={
                theme === "dark"
                  ? { fontFamily: "Inter-Bold", fontSize: 20, color: "white" }
                  : { fontSize: 20, color: "#2f2d51", fontFamily: "Inter-Bold" }
              }
            >
              An Update is Available!
            </HeaderTitle>
            <Text
              style={
                theme === "dark"
                  ? {
                      marginTop: 5,
                      textAlign: "center",
                      fontFamily: "Inter-Regular",
                      color: "white",
                    }
                  : {
                      marginTop: 5,
                      textAlign: "center",
                      color: "#2f2d51",
                      fontFamily: "Inter-Regular",
                    }
              }
            >
              Update your app to the latest version and check out our newly
              added features!
            </Text>
          </ModalIcon>
          <View
            style={{
              marginTop: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === "android") {
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp",
                  );
                }
                if (Platform.OS === "ios") {
                  Linking.openURL(
                    "https://apps.apple.com/us/app/prayerlist-app/id6443480347",
                  );
                }
              }}
              style={
                theme === "dark"
                  ? {
                      backgroundColor: "#a5c9ff",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                    }
                  : {
                      backgroundColor: "#2f2d51",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                    }
              }
            >
              <Text
                style={
                  theme === "dark"
                    ? {
                        color: "#212121",
                        fontSize: 15,
                        fontFamily: "Inter-Bold",
                      }
                    : { color: "white", fontFamily: "Inter-Bold" }
                }
              >
                Update Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={handleCloseModal}
            >
              <Text
                style={
                  theme === "dark"
                    ? {
                        textDecorationLine: "underline",
                        padding: 10,
                        fontFamily: "Inter-Regular",
                        color: "white",
                      }
                    : {
                        textDecorationLine: "underline",
                        padding: 10,
                        fontFamily: "Inter-Regular",
                        color: "#2f2d51",
                      }
                }
              >
                I&apos;ll do it later
              </Text>
            </TouchableOpacity>
          </View>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};
