import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { ModalContainer, ReactionModalContainer } from "../styles/appStyles";
import { AntDesign } from "@expo/vector-icons";
import ChatBubble from "react-native-chat-bubble";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
const ToolTip = ({ tooltipVisible, setTooltipVisible, theme }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={tooltipVisible}
      onRequestClose={() => setTooltipVisible(false)}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={() => setTooltipVisible(false)}>
        <View
          style={
            theme == "dark"
              ? {
                  padding: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                }
              : {
                  padding: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                }
          }
        >
          <View
            style={{
              backgroundColor: theme == "dark" ? "#212121" : "#93d8f8",
              width: "100%",
              padding: 15,
              borderRadius: 10,
              gap: 10,
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontSize: 18,
                textAlign: "center",
                fontFamily: "Inter-Bold",
              }}
            >
              New Reaction Feature 🙏
            </Text>
            <TouchableOpacity
              onPress={() => setTooltipVisible(false)}
              style={{ position: "absolute", top: 3, right: 3 }}
            >
              <AntDesign name="close" size={28} color="red" />
            </TouchableOpacity>
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Regular",
              }}
            >
              Press and hold a prayer to react!
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ToolTip;

const styles = StyleSheet.create({});
