import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ModalContainer, ModalView } from "../styles/appStyles";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
const AnnounceMeeting = ({
  theme,
  currGroup,
  messages,
  isAnnouncingMeeting,
  setIsAnnouncingMeeting,
}) => {
  const navigation = useNavigation();

  const handleCloseModal = () => {
    setIsAnnouncingMeeting(false);
  };

  const sendAnnounceMent = async () => {
    messages.map(async (m) => {
      console.log(m.profiles.expoToken);

      const message = {
        to: m.profiles.expoToken,
        sound: "default",
        title: "Prayer Meeting 🙏",
        body: `Join ${currGroup.groups.name}'s prayer meeting!`,
        data: { screen: "Community", group: currGroup.groups.name },
      };

      await axios.post("https://exp.host/--/api/v2/push/send", message, {
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
      });
    });
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
              fontFamily: "Inter-Medium",
              fontSize: 17,
              textAlign: "center",
            }}
          >
            Do you want to announce a prayer meeting?
          </Text>
          <TouchableOpacity
            onPress={sendAnnounceMent}
            style={{
              width: "100%",
              marginTop: 20,
              backgroundColor: theme == "dark" ? "#121212" : "#2f2d51",
              justifyContent: "center",
              alignItems: "center",
              padding: 15,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "white" : "white",
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
