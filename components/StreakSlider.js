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
import { ProgressBar } from "react-native-paper";

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
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <ModalView2
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#212121",
                  width: "95%",
                  gap: 10,
                }
              : {
                  backgroundColor: "#b7d3ff",
                  width: "95%",
                  gap: 10,
                }
          }
        >
          <AntDesign
            onPress={() => setIsShowingStreak(false)}
            style={{
              alignSelf: "flex-end",
              // position: "absolute",
              // right: 8,
              // top: 8,
            }}
            name="close"
            size={28}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter-Bold",
              fontSize: 26,
              color: theme == "dark" ? "white" : "#2f2d51",
            }}
          >
            Streaks
          </Text>
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
                Devotions Streak
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
              fontFamily: "Inter-Regular",
              textAlign: "center",
              fontSize: 13,
              marginTop: 5,
            }}
          >
            Thank you for praising God with us every day.
          </Text>
          <View
            style={{
              width: "100%",
              marginTop: 5,
              gap: 5,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: theme == "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Medium",
              }}
            >
              {((appstreak / 30) * 100).toFixed(1)}%
            </Text>
            <ProgressBar
              style={{ height: 10, borderRadius: 10 }}
              progress={appstreak / 30}
              color="green"
            />
          </View>
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Medium",
              fontSize: 13,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Reach 30 days for a chance to win a special gift!
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
                color: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                fontSize: 13,
                fontFamily: "Inter-Bold",
              }}
            >
              Share
            </Text>
            <Feather
              name="share"
              size={20}
              color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
            />
          </TouchableOpacity>
        </ModalView2>
      </ModalContainer>
    </Modal>
  );
};

export default StreakSlider;

const styles = StyleSheet.create({});
