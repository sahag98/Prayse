import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";

import prayerIcon from "../assets/prayIcon.png";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import PrayerItem from "./PrayerItem";
import { format } from "timeago.js";

const CommunityPrayers = ({
  supabase,
  visible,
  setVisible,
  onScroll,
  currentUser,
  prayers,
  setPrayers,
}) => {
  return (
    <View style={{ flex: 1 }}>
      {prayers.length == 0 ? (
        <View style={{ alignSelf: "center" }}>
          <Text style={{ fontFamily: "Inter-Medium", color: "#2f2d51" }}>
            No community prayers at this moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={prayers}
          keyExtractor={(e, i) => i.toString()}
          onEndReachedThreshold={0}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PrayerItem item={item} />}
        />
      )}
    </View>
  );
};

export default CommunityPrayers;

const styles = StyleSheet.create({});
