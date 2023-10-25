import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import {
  HeaderTitle,
  HeaderView,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const DonationModal = ({
  theme,
  donationModal,
  setIsReminderOff,
  setDonationModal,
}) => {
  const handleCloseModal = () => {
    setDonationModal(false);
  };

  const stopReminder = async () => {
    setDonationModal(false);
    await AsyncStorage.removeItem("AppOpenings");
    const reminder = await AsyncStorage.setItem("ReminderOn", "false");
    setIsReminderOff(reminder);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={donationModal}
      onRequestClose={handleCloseModal}
      statusBarTranslucent={true}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.4)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.4)" }
        }
      >
        <ModalView
          style={
            theme == "dark"
              ? { backgroundColor: "#212121", width: "100%" }
              : { backgroundColor: "#93D8F8", width: "100%" }
          }
        >
          <ModalIcon>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <HeaderTitle
                style={
                  theme == "dark"
                    ? { fontFamily: "Inter-Bold", color: "white" }
                    : { fontFamily: "Inter-Bold" }
                }
              >
                Support Prayse
              </HeaderTitle>
              <AntDesign
                name="heart"
                size={24}
                color={theme == "dark" ? "#ff6262" : "#2f2d51"}
              />
            </View>
          </ModalIcon>
          <Text
            style={
              theme == "dark"
                ? {
                    color: "white",
                    fontFamily: "Inter-Regular",
                  }
                : {
                    color: "#2f2d51",
                    fontFamily: "Inter-Regular",
                  }
            }
          >
            Dear Prayse Community, Your support means the world to us. As we
            strive to make Prayse better every day, we kindly ask for your help.
            Consider making a donation to keep Prayse thriving and accessible
            for all. Your contribution, big or small, makes a significant
            impact. Thank you for being a part of the Prayse family.
          </Text>
          <View
            style={{
              marginTop: 15,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setDonationModal(false)}
              style={
                theme == "dark"
                  ? {
                      width: "48%",
                      borderWidth: 1,
                      borderColor: "#121212",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 15,
                      borderRadius: 10,
                    }
                  : {
                      width: "48%",
                      borderWidth: 1,
                      borderColor: "#2f2d51",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 15,
                      borderRadius: 10,
                    }
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? { color: "white", fontFamily: "Inter-SemiBold" }
                    : { color: "#2f2d51", fontFamily: "Inter-SemiBold" }
                }
              >
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                theme == "dark"
                  ? {
                      width: "48%",
                      borderWidth: 1,
                      borderColor: "#ff6262",
                      backgroundColor: "#ff6262",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 15,
                      borderRadius: 10,
                    }
                  : {
                      width: "48%",
                      borderWidth: 1,
                      borderColor: "#2f2d51",
                      backgroundColor: "#2f2d51",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 15,
                      borderRadius: 10,
                    }
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? { color: "white", fontFamily: "Inter-SemiBold" }
                    : { color: "white", fontFamily: "Inter-SemiBold" }
                }
              >
                Donate
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={stopReminder}
            style={
              theme == "dark"
                ? {
                    width: "100%",
                    borderWidth: 1,
                    marginTop: 5,
                    borderColor: "#212121",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 15,
                    borderRadius: 10,
                  }
                : {
                    width: "100%",
                    borderWidth: 1,
                    marginTop: 10,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 15,
                    borderRadius: 10,
                  }
            }
          >
            <Text
              style={
                theme == "dark"
                  ? { color: "white", fontFamily: "Inter-Medium" }
                  : { color: "#2f2d51", fontFamily: "Inter-Medium" }
              }
            >
              Dont Remind me again.{" "}
            </Text>
          </TouchableOpacity>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default DonationModal;

const styles = StyleSheet.create({});
