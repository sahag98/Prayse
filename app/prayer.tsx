// @ts-nocheck
import React from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useSelector } from "react-redux";

import Home from "../components/Home";

const PrayerScreen = () => {
  const navigation = useNavigation();
  const prayerList = useSelector((state) => state.prayer.prayer);
  const { prayers, id, title, setoldPrayer } = useLocalSearchParams();

  return (
    <Home
      navigation={navigation}
      prayerList={prayerList}
      oldPrayers={prayers}
      setoldPrayer={setoldPrayer}
      folderName={title}
      folderId={id}
    />
  );
};

export default PrayerScreen;
