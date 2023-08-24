import { StyleSheet, Text, View } from "react-native";
import React from "react";
import SkeletonLoader from "expo-skeleton-loader";
import { useSelector } from "react-redux";

const Skeleton = () => {
  const theme = useSelector((state) => state.user.theme);
  return (
    <SkeletonLoader
      duration={800}
      highlightColor={theme == "dark" ? "#212121" : "white"}
      boneColor={theme == "dark" ? "#121212" : "#F2F7FF"}
      style={{ flex: 1 }}
    >
      <SkeletonLoader.Container
        style={{
          flex: 1,
          width: "100%",
          gap: 20,
          // gap: 20,
        }}
      >
        <SkeletonLoader.Item
          style={{
            width: "100%",
            height: 90,
            borderRadius: 10,
            // width: "100%",
            // height: 90,
            // borderRadius: 10,
          }}
        />
        <SkeletonLoader.Item
          style={{
            width: "100%",
            height: 90,
            borderRadius: 10,
          }}
        />
        <SkeletonLoader.Item
          style={{
            width: "100%",
            height: 90,
            borderRadius: 10,
          }}
        />
        <SkeletonLoader.Item
          style={{
            width: "100%",
            height: 90,
            borderRadius: 10,
          }}
        />
        <SkeletonLoader.Item
          style={{
            width: "100%",
            height: 90,
            borderRadius: 10,
          }}
        />
      </SkeletonLoader.Container>
    </SkeletonLoader>
  );
};
export default Skeleton;

const styles = StyleSheet.create({});
