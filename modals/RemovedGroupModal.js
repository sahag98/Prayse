import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { ModalContainer, ModalView } from "../styles/appStyles";

const RemovedGroupModal = ({
  isGroupRemoved,
  setRefreshGroup,
  setIsGroupRemoved,
  theme,
}) => {
  const navigation = useNavigation();
  const handleCloseModal = () => {
    setIsGroupRemoved(false);
    setRefreshGroup(false);
    navigation.navigate("Community");
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isGroupRemoved}
      onRequestClose={handleCloseModal}
      statusBarTranslucent
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
              textAlign: "center",
            }}
          >
            This group has been removed.
          </Text>
          <TouchableOpacity
            onPress={handleCloseModal}
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
              Exit
            </Text>
          </TouchableOpacity>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default RemovedGroupModal;

const styles = StyleSheet.create({});
