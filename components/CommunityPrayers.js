import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import NetInfo from "@react-native-community/netinfo";

import communityReady from "../hooks/communityReady";

import PrayerItem from "./PrayerItem";
import {
  getMainBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
} from "@lib/customStyles";

const CommunityPrayers = ({
  session,
  actualTheme,
  colorScheme,
  setNewPost,
  prayers,
  getPrayers,
}) => {
  const isReady = communityReady();
  const [refreshing, setRefreshing] = useState(false);

  const [isConnected, setIsConnected] = useState(null);
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected === true) {
        setIsConnected(true);
      } else setIsConnected(false);
    });
  };

  const BusyIndicator = () => {
    return (
      <View
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background flex-1 justify-center items-center"
      >
        <ActivityIndicator
          size="large"
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      </View>
    );
  };

  const handleRefresh = () => {
    setRefreshing(true); // Start the refreshing indicator
    getPrayers();
    setRefreshing(false);
    setNewPost(false); // Call your data fetching function
  };

  return (
    <View className="flex-1">
      {!isReady || !isConnected ? (
        <BusyIndicator />
      ) : (
        <FlatList
          data={prayers}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0}
          // onScroll={onScroll}
          initialNumToRender={4}
          windowSize={8}
          ListFooterComponent={() => <View className="h-28" />}
          ItemSeparatorComponent={() => (
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-primary h-[0.5px] dark:bg-dark-secondary mb-5"
            />
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              tintColor={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PrayerItem
              actualTheme={actualTheme}
              colorScheme={colorScheme}
              session={session}
              prayers={prayers}
              getPrayers={getPrayers}
              item={item}
            />
          )}
        />
      )}
    </View>
  );
};

export default CommunityPrayers;
