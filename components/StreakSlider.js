import {
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { ModalContainer, ModalView, ModalView2 } from "../styles/appStyles";
import {
  Entypo,
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
const StreakSlider = ({
  isShowingStreak,
  setIsShowingStreak,
  theme,
  streak,
  appstreak,
}) => {
  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Hey! Check out my Prayse streaks: " +
          "\n" +
          "\n" +
          `App Streak: ${0}` +
          "\n" +
          `Daily Devotions Streak: ${streak}` +
          "\n" +
          "\n" +
          "Download Prayse to get started yourself. Prayse on Android, PrayseApp on IOS.",
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isShowingStreak}
      onRequestClose={() => setIsShowingStreak(false)}
      statusBarTranslucent={true}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.4)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.4)" }
        }
      >
        <ModalView2
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#212121",
                  width: "100%",
                  gap: 15,
                }
              : {
                  backgroundColor: "#b7d3ff",
                  width: "100%",
                  gap: 15,
                }
          }
        >
          <AntDesign
            onPress={() => setIsShowingStreak(false)}
            style={{ position: "absolute", right: 8, top: 8 }}
            name="close"
            size={22}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
          <View
            style={{
              width: "100%",
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: "50%",
                alignItems: "center",
                gap: 5,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <FontAwesome
                  name="calendar-check-o"
                  size={30}
                  color={theme == "dark" ? "white" : "#2f2d51"}
                />

                <Text
                  style={{
                    color: theme == "dark" ? "white" : "#2f2d51",
                    fontFamily: "Inter-Bold",
                  }}
                >
                  {appstreak}
                </Text>
              </View>
              <Text
                style={{
                  color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Bold",
                  fontSize: 12,
                }}
              >
                App Streak
              </Text>
            </View>
            <View
              style={{
                width: "50%",
                alignItems: "center",
                gap: 5,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <MaterialCommunityIcons
                  name="hands-pray"
                  size={30}
                  color={theme == "dark" ? "white" : "#2f2d51"}
                />
                <Text
                  style={{
                    color: theme == "dark" ? "white" : "#2f2d51",
                    fontFamily: "Inter-Bold",
                  }}
                >
                  {streak}
                </Text>
              </View>
              <Text
                style={{
                  color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Bold",
                  fontSize: 12,
                }}
              >
                Daily Devotions Streak
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Regular",
              fontSize: 13,
              lineHeight: 21,
            }}
          >
            Thank you for using our app in your daily walk with God!
          </Text>
          <TouchableOpacity
            onPress={onShare}
            style={{
              alignSelf: "flex-end",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontSize: 13,
              }}
            >
              Share
            </Text>
            <Feather
              name="share"
              size={20}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
        </ModalView2>
      </ModalContainer>
    </Modal>
  );
};

export default StreakSlider;

const styles = StyleSheet.create({});
