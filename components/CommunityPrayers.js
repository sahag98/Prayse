import { StyleSheet, View, RefreshControl } from "react-native";
import { FlatList } from "react-native";
import PrayerItem from "./PrayerItem";
import Skeleton from "./Skeleton";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { useState } from "react";
import { Divider } from "react-native-paper";
import { useSelector } from "react-redux";
import communityReady from "../hooks/communityReady";
import { ActivityIndicator } from "react-native";

const CommunityPrayers = ({ session, setNewPost, prayers, getPrayers }) => {
  const theme = useSelector((state) => state.user.theme);
  const isReady = communityReady();
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = () => {
    setRefreshing(true); // Start the refreshing indicator
    getPrayers();
    setRefreshing(false);
    setNewPost(false); // Call your data fetching function
  };

  return (
    <View style={{ flex: 1 }}>
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
          ListFooterComponent={() => (
            <View
              style={
                theme == "dark"
                  ? {
                      height: 100,
                    }
                  : {
                      height: 100,
                    }
              }
            />
          )}
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
          refreshControl={
            <RefreshControl
              tintColor={theme == "dark" ? "white" : "#2f2d51"}
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PrayerItem
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

const styles = StyleSheet.create({});
