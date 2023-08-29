import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";
import PrayerItem from "./PrayerItem";
import useIsReady from "../hooks/useIsReady";
import Skeleton from "./Skeleton";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { useState } from "react";

const CommunityPrayers = ({ onScroll, prayers, getPrayers }) => {
  const isReady = useIsReady();
  const [isConnected, setIsConnected] = useState(null);
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected == true) {
        setIsConnected(true);
      } else setIsConnected(false);
    });
  };

  return (
    <View style={{ flex: 1 }}>
      {!isReady || !isConnected ? (
        <Skeleton />
      ) : (
        <FlatList
          data={prayers}
          keyExtractor={(e, i) => i.toString()}
          onEndReachedThreshold={0}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PrayerItem prayers={prayers} getPrayers={getPrayers} item={item} />
          )}
        />
      )}
    </View>
  );
};

export default CommunityPrayers;

const styles = StyleSheet.create({});
