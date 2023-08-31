import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native";
import PrayerItem from "./PrayerItem";
import useIsReady from "../hooks/useIsReady";
import Skeleton from "./Skeleton";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { useState } from "react";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";

const CommunityPrayers = ({ onScroll, prayers, getPrayers }) => {
  const theme = useSelector((state) => state.user.theme);
  const isReady = useIsReady();

  const [viewableItems, setViewableItems] = useState([]);

  const [isConnected, setIsConnected] = useState(null);
  useEffect(() => {
    checkConnection();
  }, []);

  const onViewableItemsChanged = ({ viewableItems, changed }) => {
    // `viewableItems` is an array of currently viewable items
    // `changed` is an array of items that have changed their visibility state

    // Update state or perform actions based on viewable items
    // For example:
    setViewableItems(viewableItems);

    // You can also perform actions on items that changed visibility
    // For example:
    changed.forEach(({ item, isViewable }) => {
      if (isViewable) {
        console.log(`Item ${item.id} became viewable`);
        // Perform actions when an item becomes viewable
      } else {
        console.log(`Item ${item.id} became not viewable`);
        // Perform actions when an item becomes not viewable
      }
    });
  };

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
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0}
          onScroll={onScroll}
          initialNumToRender={4}
          windowSize={8}
          ItemSeparatorComponent={() => (
            <Divider
              style={
                theme == "dark"
                  ? { backgroundColor: "#525252", marginBottom: 18 }
                  : { backgroundColor: "#2f2d51", marginBottom: 18 }
              }
            />
          )}
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
