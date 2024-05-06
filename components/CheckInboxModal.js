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
const CheckInboxModal = ({ theme, checkInbox, setCheckInbox }) => {
  const handleCloseModal = () => {
    setCheckInbox(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={checkInbox}
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
              : { backgroundColor: "#b7d3ff", width: "100%" }
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
                Check Inbox
              </HeaderTitle>
              <Feather name="inbox" size={24} color="black" />
            </View>
          </ModalIcon>
          <Text
            style={
              theme == "dark"
                ? {
                    color: "white",
                    fontFamily: "Inter-Regular",
                    textAlign: "center",
                  }
                : {
                    color: "#2f2d51",
                    fontFamily: "Inter-Regular",
                    textAlign: "center",
                  }
            }
          >
            Check your email inbox to confirm your sign up. You can't sign in
            without confirming first.
          </Text>
          <ModalActionGroup>
            <ModalAction
              color={theme == "dark" ? "#121212" : "#2F2D51"}
              onPress={handleCloseModal}
            >
              <AntDesign name="check" size={28} color={"white"} />
            </ModalAction>
          </ModalActionGroup>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default CheckInboxModal;
