import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ModalContainer, ModalView } from "../styles/appStyles";

const CompletedModal = ({ theme, showModal, setShowModal }) => {
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showModal}
      onRequestClose={handleCloseModal}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <ModalView
          style={{
            backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
            width: "90%",
            marginHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Bold",
              fontSize: 22,
            }}
          >
            Awesome Job!
          </Text>
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Regular",
              textAlign: "center",
            }}
          >
            We hope today's verse and devotional spoke to your heart in some
            way.
          </Text>
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Regular",
              textAlign: "center",
            }}
          >
            If we can pray for you, please contact us on Instagram @prayse.app
            or use the public prayers section on the community screen.
          </Text>
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Regular",
              textAlign: "center",
            }}
          >
            God bless you and have a blessed day!
          </Text>

          <TouchableOpacity
            onPress={handleCloseModal}
            style={{
              backgroundColor: theme == "dark" ? "#a5c9ff" : "#2f2d51",
              padding: 15,
              width: "100%",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "#121212" : "white",
                fontFamily: "Inter-Bold",
                textAlign: "center",
              }}
            >
              Thank You
            </Text>
          </TouchableOpacity>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default CompletedModal;

const styles = StyleSheet.create({});
