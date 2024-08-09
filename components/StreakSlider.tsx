//@ts-nocheck

import React, { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { Modal, Share, Text, TouchableOpacity, View } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { getSecondaryTextColorStyle } from "@lib/customStyles";
import { useIsFocused, useNavigationState } from "@react-navigation/native";
import { ActualTheme } from "@types/reduxTypes";

import DonationModal from "../modals/DonationModal";
import FirstCompletionModal from "../modals/FirstCompletionModal";
import PercentageModal from "../modals/PercentageModal";
import {
  changeto50,
  changeto75,
  changetoNull,
  didEnterCongrats,
  didEnterGiveaway,
  didShowDonationModal,
  resetDonationModal,
} from "../redux/userReducer";
import { ModalContainer, ModalView2 } from "../styles/appStyles";

interface StreakSliderProps {
  isShowingStreak: boolean;
  setIsShowingStreak: React.Dispatch<React.SetStateAction<boolean>>;
  actualTheme: ActualTheme;
  theme: string;
  streak: number;
  appstreak: number;
}
const StreakSlider = ({
  isShowingStreak,
  setIsShowingStreak,
  actualTheme,
  theme,
  streak,
  appstreak,
}: StreakSliderProps) => {
  const { colorScheme } = useColorScheme();
  const isShowingGiveawayModal = useSelector(
    (state) => state.user.isShowingGiveawayModal,
  );

  const navigationState = useNavigationState((state) => state);
  const isOnHomeScreen =
    navigationState.routes[navigationState.index].name === "Home";

  const isShowingCongratsModal = useSelector(
    (state) => state.user.isShowingCongratsModal,
  );
  const GOAL = 60;
  const completedItems = useSelector((state) => state.user.completedItems);
  const PercentValue = useSelector((state) => state.user.PercentValue);
  const isShowingDonationModal = useSelector(
    (state) => state.user.isShowingDonationModal,
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
            colorScheme === "dark"
              ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
              : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
          }
        >
          <ModalView2
            style={
              actualTheme && actualTheme.Secondary
                ? {
                    backgroundColor: actualTheme.Secondary,
                    width: "95%",
                    gap: 10,
                  }
                : colorScheme === "dark"
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
              className="self-end"
              onPress={() => setIsShowingStreak(false)}
              name="close"
              size={28}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              // style={getMainTextColorStyle(actualTheme)}
              className="text-center font-inter font-bold text-[26px] text-[#2f2d51] dark:text-white"
            >
              Streaks
            </Text>
            <View className="w-full mt-[10px] flex-row items-center">
              <View className="w-1/2 items-center">
                <View className="flex-row items-center gap-2">
                  <FontAwesome
                    name="calendar-check-o"
                    size={22}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "white"
                          : "#2f2d51"
                    }
                  />

                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter font-bold text-light-primary dark:text-white text-5xl"
                  >
                    {appstreak}
                  </Text>
                </View>
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter font-bold text-base text-light-primary dark:text-[#d2d2d2]"
                >
                  App Streak
                </Text>
              </View>
              <View className="w-1/2 items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="hands-pray"
                    size={22}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "white"
                          : "#2f2d51"
                    }
                  />
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter font-bold text-light-primary dark:text-white text-5xl"
                  >
                    {streak}
                  </Text>
                </View>
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter font-bold text-base text-light-primary dark:text-[#d2d2d2]"
                >
                  Devotions Streak
                </Text>
              </View>
            </View>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-normal dark:text-white text-light-primary text-center font-inter text-base mt-[5px]"
            >
              Thank you for praising God with us every day.
            </Text>
            <View className="w-full mt-[10px] gap-[10px]">
              {streak > GOAL ? null : (
                <>
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="text-center text-light-primary dark:text-white font-inter font-medium text-lg"
                  >
                    Devotions Streak: {((streak / GOAL) * 100).toFixed(1)}%
                  </Text>
                  <ProgressBar
                    style={{ height: 8, borderRadius: 10 }}
                    progress={streak / GOAL}
                    color="green"
                  />
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter font-medium text-[13px] text-center mb-[10px] text-light-primary dark:text-[#d2d2d2]"
                  >
                    Reach {GOAL} days to win a free merch item of your choice!
                  </Text>
                </>
              )}
            </View>

            <TouchableOpacity
              onPress={onShare}
              className="self-end flex-row items-center gap-[10px]"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-dark-accent text-lg font-inter font-bold"
              >
                Share
              </Text>
              <Feather
                name="share"
                size={20}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#a5c9ff"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
          </ModalView2>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default StreakSlider;