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
import {
  getPrimaryBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useDispatch } from "react-redux";
import { didEnterCongrats } from "@redux/userReducer";
const FirstCompletionModal = ({
  actualTheme,
  theme,
  congratsModal,
  setCongratsModal,
}) => {
  const dispatch = useDispatch();
  const handleCloseModal = () => {
    dispatch(didEnterCongrats());
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
          className="bg-light-secondary dark:bg-dark-secondary w-4/5"
          style={getSecondaryBackgroundColorStyle(actualTheme)}
        >
          <ModalIcon>
            <View className="flex-row items-center gap-3">
              <HeaderTitle className="font-inter-bold text-light-primary dark:text-dark-primary">
                Great Job!
              </HeaderTitle>
              <MaterialIcons
                name="celebration"
                size={28}
                color={theme === "dark" ? "#ff6262" : "#ff6262"}
              />
            </View>
          </ModalIcon>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter-medium mb-3 text-light-primary dark:text-dark-primary"
          >
            You have completed your first day of daily devotions. Come back
            tomorrow to start you streak.
          </Text>

          <TouchableOpacity
            onPress={handleCloseModal}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="w-full items-center justify-center bg-light-primary dark:bg-dark-accent p-4 rounded-lg"
          >
            <Text className="font-inter-bold text-light-background dark:bg-dark-background">
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
