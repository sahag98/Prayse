import { Linking, Modal, Text, TouchableOpacity, View } from "react-native";

import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  HeaderTitle,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";
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
    await AsyncStorage.setItem("ReminderOn", "false");
    setIsReminderOff(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={donationModal}
      onRequestClose={handleCloseModal}
      statusBarTranslucent
    >
      <ModalContainer
        style={
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.4)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.4)" }
        }
      >
        <ModalView
          style={
            theme === "dark"
              ? { backgroundColor: "#212121", width: "100%" }
              : { backgroundColor: "#b7d3ff", width: "100%" }
          }
        >
          <ModalIcon>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <HeaderTitle
                style={
                  theme === "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        letterSpacing: 1,
                        color: "white",
                      }
                    : {
                        fontFamily: "Inter-Bold",
                        color: "#2f2d51",
                        letterSpacing: 1,
                      }
                }
              >
                Support Prayse
              </HeaderTitle>
              <AntDesign
                name="heart"
                size={24}
                color={theme === "dark" ? "#ff6262" : "#ff6262"}
              />
            </View>
          </ModalIcon>
          <Text
            style={
              theme === "dark"
                ? {
                    color: "white",
                    fontFamily: "Inter-Regular",
                    fontSize: 14,
                    marginBottom: 10,
                    lineHeight: 21,
                  }
                : {
                    color: "#2f2d51",
                    lineHeight: 21,
                    fontSize: 14,
                    marginBottom: 10,
                    fontFamily: "Inter-Regular",
                  }
            }
          >
            Dear Prayse Community, as we strive to reiterate the importance of
            prayer and praise in today's world, we would like to give you the
            opportunity to express your generosity.
          </Text>
          <Text
            style={
              theme === "dark"
                ? {
                    color: "white",
                    fontFamily: "Inter-Regular",
                    fontSize: 14,
                  }
                : {
                    color: "#2f2d51",
                    fontSize: 14,
                    lineHeight: 21,
                    fontFamily: "Inter-Regular",
                  }
            }
          >
            Remember, you're giving through Prayse, not to Prayse.
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
                theme === "dark"
                  ? {
                      width: "48%",
                      borderWidth: 1,
                      flexDirection: "row",
                      borderColor: "#121212",
                      backgroundColor: "#121212",
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
                  theme === "dark"
                    ? { color: "white", fontFamily: "Inter-Bold" }
                    : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                }
              >
                Close
              </Text>
              {/* <FontAwesome5 name="heart" size={20} color="white" /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.buymeacoffee.com/prayse")
              }
              style={
                theme === "dark"
                  ? {
                      width: "48%",
                      flexDirection: "row",
                      backgroundColor: "#ff6262",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 10,
                      padding: 15,
                      borderRadius: 10,
                    }
                  : {
                      width: "48%",

                      flexDirection: "row",
                      backgroundColor: "#2f2d51",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 10,
                      padding: 15,
                      borderRadius: 10,
                    }
              }
            >
              <Text
                style={
                  theme === "dark"
                    ? { color: "white", fontFamily: "Inter-Bold" }
                    : { color: "white", fontFamily: "Inter-Bold" }
                }
              >
                Give
              </Text>
              <FontAwesome5 name="heart" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={stopReminder}
            style={
              theme === "dark"
                ? {
                    width: "100%",

                    marginTop: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 15,
                    borderRadius: 10,
                  }
                : {
                    width: "100%",
                    marginTop: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 15,
                    borderRadius: 10,
                  }
            }
          >
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "#bebebe",
                      fontSize: 13,
                      fontFamily: "Inter-Regular",
                    }
                  : {
                      color: "#2f2d51",
                      fontSize: 13,
                      fontFamily: "Inter-Regular",
                    }
              }
            >
              Don't Remind me again
            </Text>
          </TouchableOpacity>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default DonationModal;
