// @ts-nocheck
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";

import StreakSlider from "@components/StreakSlider";

import { CheckReview } from "@hooks/useShowReview";
import { getMainTextColorStyle } from "@lib/customStyles";
import { increaseAppStreakCounter } from "@redux/userReducer";
import { ActualTheme } from "@types/reduxTypes";

interface StreakActionProps {
  theme: string;
  actualTheme: ActualTheme;
}
export const StreakAction: React.FC<StreakActionProps> = ({
  theme,
  actualTheme,
}) => {
  const streak = useSelector((state) => state.user.devostreak);
  const appstreak = useSelector((state) => state.user.appstreakNum);
  const dispatch = useDispatch();
  const [isShowingStreak, setIsShowingStreak] = useState(false);

  async function appStreak() {
    const today = new Date().toLocaleDateString("en-CA");

    console.log("today", today);

    dispatch(increaseAppStreakCounter({ today }));
  }

  useEffect(() => {
    appStreak();

    if (appstreak !== 0 && appstreak % 10 === 0) {
      CheckReview();
    }
  }, []);

  return (
    <View className="flex items-center flex-row">
      <StreakSlider
        appstreak={appstreak}
        streak={streak}
        actualTheme={actualTheme}
        theme={theme}
        setIsShowingStreak={setIsShowingStreak}
        isShowingStreak={isShowingStreak}
      />
      <TouchableOpacity
        onPress={() => setIsShowingStreak((prev) => !prev)}
        className="flex-row p-2 items-center"
      >
        <View className="flex-row items-center gap-1">
          <MaterialCommunityIcons
            style={{ zIndex: 10 }}
            name="hands-pray"
            size={20}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : theme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />

          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="text-light-primary dark:text-white font-inter font-bold"
          >
            {streak?.toString() ?? "0"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
