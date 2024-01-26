import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ModalContainer } from "../styles/appStyles";
import { AntDesign } from "@expo/vector-icons";
const ReminderModal = ({
  theme,
  reminder,
  note,
  reminderVisible,
  setReminderVisible,
}) => {
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
                  borderRadius: 10,
                  position: "relative",
                  marginHorizontal: 10,
                  padding: 15,
                  width: "80%",
                  justifyContent: "center",
                  gap: 10,
                  backgroundColor: "#212121",
                }
              : {
                  borderRadius: 10,
                  position: "relative",
                  marginHorizontal: 10,
                  padding: 15,
                  width: "80%",
                  justifyContent: "center",

                  gap: 10,
                  backgroundColor: "#93D8F8",
                }
          }
        >
          <TouchableOpacity
            onPress={() => setReminderVisible(false)}
            style={{ position: "absolute", top: 5, padding: 5, right: 5 }}
          >
            <AntDesign
              name="close"
              size={28}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <Text
            style={
              theme == "dark"
                ? {
                    marginVertical: 20,
                    textAlign: "center",
                    fontFamily: "Inter-Bold",
                    color: "white",
                    fontSize: 20,
                    letterSpacing: 1,
                  }
                : {
                    marginVertical: 20,
                    textAlign: "center",
                    fontFamily: "Inter-Bold",
                    color: "#2f2d51",
                    fontSize: 20,
                    letterSpacing: 1,
                  }
            }
          >
            Prayer Reminder
          </Text>
          <View>
            <Text
              style={
                theme == "dark"
                  ? {
                      fontFamily: "Inter-Medium",
                      color: "white",
                      fontSize: 16,
                    }
                  : {
                      fontFamily: "Inter-Medium",
                      color: "#2f2d51",
                      fontSize: 16,
                    }
              }
            >
              Title:
            </Text>
            <Text
              style={
                theme == "dark"
                  ? {
                      fontFamily: "Inter-Regular",
                      color: "white",
                      fontSize: 14,
                    }
                  : {
                      fontFamily: "Inter-Regular",
                      color: "#2f2d51",
                      fontSize: 14,
                    }
              }
            >
              {reminder}
            </Text>
          </View>
          <View>
            {note && (
              <>
                <Text
                  style={
                    theme == "dark"
                      ? {
                          fontFamily: "Inter-Medium",
                          color: "white",
                          fontSize: 15,
                        }
                      : {
                          fontFamily: "Inter-Medium",
                          color: "#2f2d51",
                          fontSize: 15,
                        }
                  }
                >
                  Note:
                </Text>

                <Text
                  style={
                    theme == "dark"
                      ? {
                          fontFamily: "Inter-Regular",
                          color: "white",
                          fontSize: 14,
                        }
                      : {
                          fontFamily: "Inter-Regular",
                          color: "#2f2d51",
                          fontSize: 14,
                        }
                  }
                >
                  {note}
                </Text>
              </>
            )}
          </View>
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default ReminderModal;

const styles = StyleSheet.create({});
