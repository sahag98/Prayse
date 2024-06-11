import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";

import Home from "../components/Home";
import useIsReady from "../hooks/useIsReady";

const PrayerPage = ({ route, navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const isReady = useIsReady();
  const prayerList = useSelector((state) => state.prayer.prayer);
  const { prayers, id, title, setoldPrayer } = route.params;

  const BusyIndicator = () => {
    return (
      <View
        style={
          theme == "dark"
            ? { backgroundColor: "#121212", flex: 1, justifyContent: "center" }
            : { backgroundColor: "#F2F7FF", flex: 1, justifyContent: "center" }
        }
      >
        <ActivityIndicator
          size="large"
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>
    );
  };

  if (!isReady) {
    return <BusyIndicator />;
  }

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

export default PrayerPage;
