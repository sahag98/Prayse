import React, { useEffect } from "react";
import { Modal, Share, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { didEnterGiveaway } from "../redux/userReducer";
import { ModalContainer, ModalView2 } from "../styles/appStyles";

const StreakSlider = ({
  isShowingStreak,
  setIsShowingStreak,
  theme,
  streak,
  appstreak,
}) => {
  const isShowingGiveawayModal = useSelector(
    (state) => state.user.isShowingGiveawayModal,
  );

  const dispatch = useDispatch();
  useEffect(() => {
    console.log("app streak check: ", appstreak);
    console.log("is Showing Giveaway modal: ", isShowingGiveawayModal);
    if (appstreak === 1 && isShowingGiveawayModal === false) {
      console.log("entering giveaway!!");
      dispatch(didEnterGiveaway());
    }
  }, [appstreak]);

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
      transparent
      visible={isShowingStreak}
      onRequestClose={() => setIsShowingStreak(false)}
      statusBarTranslucent
    >
      <ModalContainer
        style={
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <ModalView2
          style={
            theme === "dark"
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
            }}
            name="close"
            size={28}
            color={theme === "dark" ? "white" : "#2f2d51"}
          />
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter-Bold",
              fontSize: 26,
              color: theme === "dark" ? "white" : "#2f2d51",
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
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <FontAwesome
                  name="calendar-check-o"
                  size={22}
                  color={theme === "dark" ? "white" : "#2f2d51"}
                />

                <Text
                  style={{
                    color: theme === "dark" ? "white" : "#2f2d51",
                    fontFamily: "Inter-Bold",
                    fontSize: 35,
                  }}
                >
                  {appstreak}
                </Text>
              </View>
              <Text
                style={{
                  color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Bold",
                  fontSize: 13,
                }}
              >
                App Streak
              </Text>
            </View>
            <View
              style={{
                width: "50%",
                alignItems: "center",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <MaterialCommunityIcons
                  name="hands-pray"
                  size={22}
                  color={theme === "dark" ? "white" : "#2f2d51"}
                />
                <Text
                  style={{
                    color: theme === "dark" ? "white" : "#2f2d51",
                    fontFamily: "Inter-Bold",
                    fontSize: 35,
                  }}
                >
                  {streak}
                </Text>
              </View>
              <Text
                style={{
                  color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Bold",
                  fontSize: 13,
                }}
              >
                Devotions Streak
              </Text>
            </View>
          </View>
          <Text
            style={{
              color: theme === "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Regular",
              textAlign: "center",
              fontSize: 15,
              marginTop: 5,
            }}
          >
            Thank you for praising God with us every day.
          </Text>
          <View
            style={{
              width: "100%",
              marginTop: 10,
              gap: 5,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: theme === "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Medium",
                fontSize: 16,
              }}
            >
              {((appstreak / 1) * 100).toFixed(1)}%
            </Text>
            <ProgressBar
              style={{ height: 8, borderRadius: 10 }}
              progress={appstreak / 1}
              color="green"
            />
          </View>
          <Text
            style={{
              color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
              fontFamily: "Inter-Medium",
              fontSize: 13,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Reach 1 day for to win a special gift!
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
                color: theme === "dark" ? "#a5c9ff" : "#2f2d51",
                fontSize: 13,
                fontFamily: "Inter-Bold",
              }}
            >
              Share
            </Text>
            <Feather
              name="share"
              size={20}
              color={theme === "dark" ? "#a5c9ff" : "#2f2d51"}
            />
          </TouchableOpacity>
        </ModalView2>
      </ModalContainer>
    </Modal>
  );
};

export default StreakSlider;
