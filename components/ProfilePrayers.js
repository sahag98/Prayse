import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";

const ProfilePrayers = ({
  item,
  theme,
  getPrayers,
  getUserPrayers,
  supabase,
}) => {
  const [deleteModal, setDeleteModal] = useState(false);

  async function handleDelete(id) {
    setDeleteModal(false);
    await supabase.from("prayers").delete().eq("id", id);
    getUserPrayers();
    getPrayers();
  }

  return (
    <View
      style={
        theme === "dark" ? styles.prayerContainerDark : styles.prayerContainer
      }
    >
      <Text
        style={
          theme === "dark"
            ? {
                fontFamily: "Inter-Regular",
                color: "white",
                width: "80%",
                lineHeight: 20,
              }
            : {
                fontFamily: "Inter-Regular",
                color: "#2f2d51",
                width: "80%",
                lineHeight: 20,
              }
        }
      >
        {item.prayer}
      </Text>
      <TouchableOpacity
        // style={{ backgroundColor: "red", height: "100%", width: "20%" }}
        onPress={() => setDeleteModal(true)}
      >
        <AntDesign
          style={{ alignSelf: "center", verticalAlign: "middle" }}
          name="close"
          size={25}
          color={theme === "dark" ? "#ff4e4e" : "#cb3f68"}
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent
        visible={deleteModal}
        onRequestClose={() => setDeleteModal(false)}
        statusBarTranslucent
        // onShow={() => inputRef.current?.focus()}
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
                ? { backgroundColor: "#212121" }
                : { backgroundColor: "#93D8F8" }
            }
          >
            <ModalIcon>
              <HeaderTitle
                style={
                  theme === "dark"
                    ? { fontFamily: "Inter-Bold", fontSize: 18, color: "white" }
                    : { fontSize: 18, fontFamily: "Inter-Bold" }
                }
              >
                Are you sure you want to delete this prayer?
              </HeaderTitle>
            </ModalIcon>
            <ModalActionGroup>
              <ModalAction color="white" onPress={() => setDeleteModal(false)}>
                <AntDesign
                  name="close"
                  size={28}
                  color={theme === "dark" ? "black" : "#2F2D51"}
                />
              </ModalAction>
              <ModalAction
                color={theme === "dark" ? "#121212" : "#2F2D51"}
                onPress={() => handleDelete(item.id)}
              >
                <AntDesign name="check" size={28} color="white" />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </Modal>
    </View>
  );
};

export default ProfilePrayers;

const styles = StyleSheet.create({
  prayerContainer: {
    width: "100%",
    borderBottomWidth: 0.8,
    padding: 10,
    borderBottomColor: "#2f2d51",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  prayerContainerDark: {
    width: "100%",
    borderBottomWidth: 0.8,
    padding: 10,
    borderBottomColor: "#797979",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
