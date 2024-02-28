import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";

import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
  Entypo,
  Octicons,
  Ionicons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const NotifyFirstMsg = ({
  allGroups,
  currGroup,
  currentUser,
  supabase,
  messagetoNotify,
  showToast,
  messages,
  isNotifyVisible,
  setIsNotifyVisible,
  theme,
}) => {
  const sendAnnounceMent = async () => {
    let { data: members, error } = await supabase
      .from("members")
      .select("*, profiles(id, expoToken)")
      .eq("group_id", currGroup.groups?.id)
      .order("id", { ascending: false });

    members.map(async (m) => {
      if (m.profiles.expoToken != currentUser.expoToken) {
        const message = {
          to: m.profiles.expoToken,
          sound: "default",
          title: `${currGroup.groups.name} 📢`,
          body: `${currentUser}: ${messagetoNotify}`,
          data: {
            screen: "Community",
            currGroup: currGroup,
            allGroups: allGroups,
          },
        };
        await axios.post("https://exp.host/--/api/v2/push/send", message, {
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        });
      }
    });
    await AsyncStorage.removeItem("isNotify");
    setIsNotifyVisible(false);
    showToast("success", "Members are notified.");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isNotifyVisible}
      onRequestClose={() => setIsNotifyVisible(false)}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={() => setIsNotifyVisible(false)}>
        <View
          style={
            theme == "dark"
              ? {
                  padding: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                }
              : {
                  padding: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                }
          }
        >
          <View
            style={{
              backgroundColor: theme == "dark" ? "#212121" : "#93d8f8",
              width: "100%",
              padding: 15,
              borderRadius: 10,
              gap: 10,
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontSize: 20,
                textAlign: "center",
                fontFamily: "Inter-Bold",
              }}
            >
              Notify Members
            </Text>

            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Regular",
              }}
            >
              Do you want to notify all the group members with this new prayer
              request?
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                gap: 10,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setIsNotifyVisible(false);
                  await AsyncStorage.removeItem("isNotify");
                }}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>No Don't</Text>
                <MaterialCommunityIcons
                  name="cancel"
                  size={24}
                  color="#2f2d51"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={sendAnnounceMent}
                style={[
                  styles.actionButton,
                  { backgroundColor: theme == "dark" ? "#a5c9ff" : "#2f2d51" },
                ]}
              >
                <Text
                  style={[
                    styles.actionText,
                    { color: theme == "dark" ? "#121212" : "white" },
                  ]}
                >
                  Yes Notify
                </Text>
                <Ionicons
                  name="megaphone-outline"
                  size={24}
                  color={theme == "dark" ? "#121212" : "white"}
                />
              </TouchableOpacity>
            </View>
            <Text
              onPress={async () => {
                setIsNotifyVisible(false);
                await AsyncStorage.setItem("isNotify", "disable");
              }}
              style={styles.dismiss}
            >
              Don't remind me again.
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NotifyFirstMsg;

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderColor: "#2f2d51",
    padding: 12,
    borderRadius: 10,
  },
  actionText: {
    fontFamily: "Inter-Medium",
  },
  dismiss: {
    alignSelf: "center",
    marginTop: 5,
    fontSize: 13,
    color: "red",
  },
});
