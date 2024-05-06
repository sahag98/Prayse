import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Modal } from "react-native";
import {
  HeaderTitle,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";
import { TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import { Linking } from "react-native";

const UpdateModal = ({ theme, isUpdateAvailable, setIsUpdateAvailable }) => {
  const handleCloseModal = () => {
    setIsUpdateAvailable(false);
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isUpdateAvailable}
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
              ? { backgroundColor: "#212121", width: "85%" }
              : { backgroundColor: "#b7d3ff", width: "85%" }
          }
        >
          <ModalIcon>
            <HeaderTitle
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", fontSize: 20, color: "white" }
                  : { fontSize: 20, color: "#2f2d51", fontFamily: "Inter-Bold" }
              }
            >
              An Update is Available!
            </HeaderTitle>
            <Text
              style={
                theme == "dark"
                  ? {
                      marginTop: 5,
                      textAlign: "center",
                      fontFamily: "Inter-Regular",
                      color: "white",
                    }
                  : {
                      marginTop: 5,
                      textAlign: "center",
                      color: "#2f2d51",
                      fontFamily: "Inter-Regular",
                    }
              }
            >
              Update your app to the latest version and check out our newly
              added features!
            </Text>
          </ModalIcon>
          <View
            style={{
              marginTop: 10,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS == "android") {
                  Linking.openURL(
                    "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp"
                  );
                }
                if (Platform.OS == "ios") {
                  Linking.openURL(
                    "https://apps.apple.com/us/app/prayerlist-app/id6443480347"
                  );
                }
              }}
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "#a5c9ff",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                    }
                  : {
                      backgroundColor: "#2f2d51",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                    }
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#212121",
                        fontSize: 15,
                        fontFamily: "Inter-Bold",
                      }
                    : { color: "white", fontFamily: "Inter-Bold" }
                }
              >
                Update Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setIsUpdateAvailable(false)}
            >
              <Text
                style={
                  theme == "dark"
                    ? {
                        textDecorationLine: "underline",
                        padding: 10,
                        fontFamily: "Inter-Regular",
                        color: "white",
                      }
                    : {
                        textDecorationLine: "underline",
                        padding: 10,
                        fontFamily: "Inter-Regular",
                        color: "#2f2d51",
                      }
                }
              >
                I&apos;ll do it later
              </Text>
            </TouchableOpacity>
          </View>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default UpdateModal;

const styles = StyleSheet.create({});
