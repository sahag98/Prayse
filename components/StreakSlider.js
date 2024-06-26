import React, { useEffect, useState } from "react";
import { Modal, Share, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  changeto25,
  changeto50,
  changeto75,
  changetoNull,
  didEnterCongrats,
  didEnterGiveaway,
  didShowDonationModal,
  resetCongrats,
  resetDonationModal,
  resetGiveaway,
  setNeededValues,
} from "../redux/userReducer";
import { ModalContainer, ModalView2 } from "../styles/appStyles";
import DonationModal from "./DonationModal";
import FirstCompletionModal from "./FirstCompletionModal";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import PercentageModal from "./PercentageModal";
import { useNavigationState } from "@react-navigation/native";
const StreakSlider = ({
  isShowingStreak,
  setIsShowingStreak,
  theme,
  streak,
  appstreak,
}) => {
  const isShowingGiveawayModal = useSelector(
    (state) => state.user.isShowingGiveawayModal
  );
  const navigationState = useNavigationState((state) => state);
  const isOnHomeScreen =
    navigationState.routes[navigationState.index].name === "Home";

  const isShowingCongratsModal = useSelector(
    (state) => state.user.isShowingCongratsModal
  );
  const GOAL = 60;

  const completedItems = useSelector((state) => state.user.completedItems);
  const PercentValue = useSelector((state) => state.user.PercentValue);
  console.log(isShowingGiveawayModal);
  const isShowingDonationModal = useSelector(
    (state) => state.user.isShowingDonationModal
  );
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [donationModal, setDonationModal] = useState(false);
  const [congratsModal, setCongratsModal] = useState(false);
  const [percentModal, setPercentModal] = useState(false);
  const [percentage, setPercentage] = useState();

  useEffect(() => {
    // dispatch(setNeededValues());
    // dispatch(resetCongrats());
    console.log(
      "checking:   ",
      completedItems.length,
      completedItems[0]?.items?.length,
      isShowingCongratsModal,
      isOnHomeScreen
    );
    if (
      completedItems.length === 1 &&
      completedItems[0].items.length === 3 &&
      isShowingCongratsModal === false &&
      isOnHomeScreen
    ) {
      console.log("first completed devotions!!!!");
      dispatch(didEnterCongrats());
      setCongratsModal(true);
    }
    console.log("congrats modal: ", congratsModal);
  }, [isFocused]);

  useEffect(() => {
    // dispatch(changeto25());
    if (GOAL * 0.25 === streak && PercentValue === 25 && isOnHomeScreen) {
      console.log("show 25% modal");
      dispatch(changeto50());
      setPercentage(25);
      setPercentModal(true);
    } else if (GOAL * 0.5 === streak && PercentValue === 50 && isOnHomeScreen) {
      console.log("show 50% modal");
      dispatch(changeto75());
      setPercentage(50);
      setPercentModal(true);
    } else if (
      GOAL * 0.75 === streak &&
      PercentValue === 75 &&
      isOnHomeScreen
    ) {
      console.log("show 75% modal");
      dispatch(changetoNull());
      setPercentage(75);
      setPercentModal(true);
    }
    if (streak === GOAL && isShowingGiveawayModal === false && isOnHomeScreen) {
      dispatch(didEnterGiveaway());
    }
  }, [streak, isFocused]);

  useEffect(() => {
    // dispatch(didShowDonationModal());
    // dispatch(resetDonationModal());
    if (appstreak % 10 !== 0) {
      dispatch(resetDonationModal());
    }
    if (
      appstreak !== 0 &&
      appstreak % 10 === 0 &&
      isShowingDonationModal === false
    ) {
      console.log("should show support modal now: ", `${appstreak}/10`);
      dispatch(didShowDonationModal());
      setDonationModal(true);
    }
  }, [appstreak]);

  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Hey! Check out my Prayse streaks: " +
          "\n" +
          "\n" +
          `App Streak: ${appstreak}` +
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
    <>
      <PercentageModal
        percentModal={percentModal}
        setPercentModal={setPercentModal}
        percent={percentage}
        theme={theme}
      />

      <FirstCompletionModal
        congratsModal={congratsModal}
        setCongratsModal={setCongratsModal}
        theme={theme}
      />
      <DonationModal
        donationModal={donationModal}
        setDonationModal={setDonationModal}
        theme={theme}
      />
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
            {congratsModal && <Text style={{ color: "red" }}>Show</Text>}
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
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
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
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
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
                gap: 10,
              }}
            >
              {streak > GOAL ? null : (
                <>
                  <Text
                    style={{
                      textAlign: "center",
                      color: theme === "dark" ? "white" : "#2f2d51",
                      fontFamily: "Inter-Medium",
                      fontSize: 16,
                    }}
                  >
                    Devotions Streak: {((streak / GOAL) * 100).toFixed(1)}%
                  </Text>
                  <ProgressBar
                    style={{ height: 8, borderRadius: 10 }}
                    progress={streak / GOAL}
                    color="green"
                  />
                  <Text
                    style={{
                      color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
                      fontFamily: "Inter-Medium",
                      fontSize: 13,
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                  >
                    Reach {GOAL} days to win a free merch item of your choice!
                  </Text>
                </>
              )}
            </View>

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
                  fontSize: 15,
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
    </>
  );
};

export default StreakSlider;
