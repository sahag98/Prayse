import React from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useSelector } from "react-redux";

import Home from "../components/Home";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

const PrayerScreen = () => {
  const navigation = useNavigation();
  const prayerList = useSelector((state: any) => state.prayer.prayer);
  const { prayers, id, title, setoldPrayer } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  return (
    <SafeAreaView
      edges={["top"]}
      // style={getMainBackgroundColorStyle(actualTheme)}
      style={{
        backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
      }}
    >
      <Home
        navigation={navigation}
        prayerList={prayerList}
        oldPrayers={prayers}
        setoldPrayer={setoldPrayer}
        folderName={title}
        folderId={id}
      />
    </SafeAreaView>
  );
};

export default PrayerScreen;
