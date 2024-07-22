// @ts-nocheck
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";

import StreakSlider from "@components/StreakSlider";

import { increaseAppStreakCounter } from "@redux/userReducer";

interface StreakActionProps {
  theme: string;
}
export const StreakAction: React.FC<StreakActionProps> = ({ theme }) => {
  const streak = useSelector((state) => state.user.devostreak);
  const appstreak = useSelector((state) => state.user.appstreakNum);
  const dispatch = useDispatch();
  const [isShowingStreak, setIsShowingStreak] = useState(false);

  async function appStreak() {
    const today = new Date().toLocaleDateString("en-CA");

    dispatch(increaseAppStreakCounter({ today }));
  }

  useEffect(() => {
    appStreak();
  }, []);

  return (
    <View className="flex items-center flex-row">
      <StreakSlider
        appstreak={appstreak}
        streak={streak}
        theme={theme}
        setIsShowingStreak={setIsShowingStreak}
        isShowingStreak={isShowingStreak}
      />
      <TouchableOpacity
        onPress={() => setIsShowingStreak((prev) => !prev)}
        className="flex-row  p-[8px] items-center"
      >
        <View className="flex-row items-center gap-1">
          <MaterialCommunityIcons
            style={{ zIndex: 10 }}
            name="hands-pray"
            size={20}
            color={theme === "dark" ? "white" : "#2f2d51"}
          />

          <Text className="text-[#2f2d51] dark:text-white font-inter font-bold">
            {streak?.toString() ?? "0"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
