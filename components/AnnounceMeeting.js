import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ModalContainer, ModalView } from "../styles/appStyles";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Toast from "react-native-toast-message";
const AnnounceMeeting = ({
  theme,
  currGroup,
  currentUser,
  hasAnnounced,
  setHasAnnounced,
  allGroups,
  messages,
  supabase,
  isAnnouncingMeeting,
  setIsAnnouncingMeeting,
}) => {
  const navigation = useNavigation();

  const handleCloseModal = () => {
    setIsAnnouncingMeeting(false);
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: "Announcement was sent!",
      visibilityTime: 3000,
    });
  };

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
          body: `Join prayer meeting 🙏`,
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
    showToast();
    setHasAnnounced(true);
    setIsAnnouncingMeeting(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isAnnouncingMeeting}
      onRequestClose={handleCloseModal}
      statusBarTranslucent={true}
      // onShow={() => inputRef.current?.focus()}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <ModalView
          style={
            theme == "dark"
              ? { backgroundColor: "#212121", width: "100%" }
              : { backgroundColor: "#93D8F8", width: "100%" }
          }
        >
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Bold",
              fontSize: 17,
              textAlign: "center",
            }}
          >
            Do you want to announce a prayer meeting?
          </Text>
          <Text
            style={{
              color: theme == "dark" ? "red" : "red",
              marginTop: 10,
              fontFamily: "Inter-Regular",

              textAlign: "left",
            }}
          >
            You can announce a meeting once every 5 minutes.
          </Text>
          <TouchableOpacity
            onPress={sendAnnounceMent}
            style={{
              width: "100%",
              marginTop: 20,
              backgroundColor: theme == "dark" ? "#a5c9ff" : "#2f2d51",
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "#121212" : "white",
                fontFamily: "Inter-Bold",
              }}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCloseModal}
            style={{
              width: "100%",
              marginTop: 10,
              backgroundColor: theme == "dark" ? "#121212" : "#f2f7ff",
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Bold",
              }}
            >
              No
            </Text>
          </TouchableOpacity>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default AnnounceMeeting;

const styles = StyleSheet.create({});
