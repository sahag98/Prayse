import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import {
  HeaderTitle,
  ModalContainer,
  ModalIcon,
  ModalView,
  ModalView2,
} from "../styles/appStyles";
import LottieView from "lottie-react-native";
const FirstCompletionModal = ({ theme, congratsModal, setCongratsModal }) => {
  const handleCloseModal = () => {
    setCongratsModal(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={congratsModal}
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
        <LottieView
          source={require("../assets/animations/congrats-lottie.json")}
          style={styles.animation}
          autoPlay
          resizeMode="none"
        />
        <ModalView2
          style={
            theme === "dark"
              ? { backgroundColor: "#212121", width: "90%" }
              : { backgroundColor: "#b7d3ff", width: "90%" }
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
                Congratulations!
              </HeaderTitle>
              <MaterialIcons
                name="celebration"
                size={28}
                color={theme === "dark" ? "#ff6262" : "#ff6262"}
              />
            </View>
          </ModalIcon>
          <Text
            style={
              theme === "dark"
                ? {
                    color: "white",
                    fontFamily: "Inter-Medium",
                    fontSize: 15,
                    marginBottom: 10,
                    lineHeight: 21,
                  }
                : {
                    color: "#2f2d51",
                    lineHeight: 21,
                    fontSize: 15,
                    marginBottom: 10,
                    fontFamily: "Inter-Medium",
                  }
            }
          >
            You have completed your first day of daily devotions. Come back
            tomorrow to start your streak!
          </Text>

          <TouchableOpacity
            onPress={handleCloseModal}
            style={
              theme === "dark"
                ? {
                    width: "100%",
                    flexDirection: "row",
                    backgroundColor: "#a5c9ff",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    padding: 15,
                    borderRadius: 10,
                  }
                : {
                    width: "100%",

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
                  ? { color: "#121212", fontFamily: "Inter-Bold" }
                  : { color: "white", fontFamily: "Inter-Bold" }
              }
            >
              Okay
            </Text>
          </TouchableOpacity>
        </ModalView2>
      </ModalContainer>
    </Modal>
  );
};

export default FirstCompletionModal;

const styles = StyleSheet.create({
  animation: {
    position: "absolute",
    top: 10,
    width: 400,
    height: 400,
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
  },
});
