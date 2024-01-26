import { StyleSheet, Text, View } from "react-native";
import React from "react";
// import SkeletonLoader from "expo-skeleton-loader";
import { useSelector } from "react-redux";

const Skeleton = () => {
  const theme = useSelector((state) => state.user.theme);
  return (
    <View>
      <Text>hey</Text>
    </View>
  );
};
export default Skeleton;

const styles = StyleSheet.create({
  skeleton: {
    width: "100%",
    height: 90,
    borderRadius: 10,
  },
});
