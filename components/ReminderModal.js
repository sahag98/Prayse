import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ModalContainer } from "../styles/appStyles";
import { AntDesign } from "@expo/vector-icons";
const ReminderModal = ({
  theme,
  reminder,
  reminderVisible,
  setReminderVisible,
}) => {
  console.log(reminder.message);
  return (
    <Modal
      key={reminder.id}
      animationType="fade"
      transparent={true}
      visible={reminderVisible}
      onRequestClose={() => setReminderVisible(false)}
      statusBarTranslucent={true}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.9)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.9)" }
        }
      >
        <View
          style={
            theme == "dark"
              ? {
                  borderRadius: 5,
                  position: "relative",
                  padding: 15,
                  width: "100%",
                  justifyContent: "center",
                  gap: 10,
                  alignItems: "center",
                  backgroundColor: "#212121",
                }
              : {
                  borderRadius: 5,
                  position: "relative",
                  padding: 15,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#93D8F8",
                }
          }
        >
          <TouchableOpacity
            onPress={() => setReminderVisible(false)}
            style={{ position: "absolute", top: 5, padding: 5, right: 5 }}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text
            style={
              theme == "dark"
                ? {
                    marginTop: 20,
                    textAlign: "center",
                    fontFamily: "Inter-Bold",
                    color: "white",
                    fontSize: 18,
                    letterSpacing: 1,
                  }
                : {
                    marginTop: 20,
                    textAlign: "center",
                    fontFamily: "Inter-Bold",
                    color: "#2f2d51",
                    fontSize: 18,
                  }
            }
          >
            Prayer Reminder
          </Text>
          <Text
            style={
              theme == "dark"
                ? {
                    fontFamily: "Inter-Medium",
                    color: "white",
                    fontSize: 14,
                    letterSpacing: 1,
                  }
                : {
                    fontFamily: "Inter-Medium",
                    color: "#2f2d51",
                    fontSize: 14,
                  }
            }
          >
            {reminder.message}
          </Text>
          {reminder.note && (
            <Text
              style={
                theme == "dark"
                  ? {
                      fontFamily: "Inter-Regular",
                      color: "grey",
                      fontSize: 13,
                      letterSpacing: 1,
                    }
                  : {
                      fontFamily: "Inter-Regular",
                      color: "#2f2d51",
                      fontSize: 13,
                    }
              }
            >
              {reminder.note}
            </Text>
          )}
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default ReminderModal;

const styles = StyleSheet.create({});
