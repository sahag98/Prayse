import React, { useCallback, useRef, useState } from "react";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";

import { useSelector } from "react-redux";

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { AntDesign } from "@expo/vector-icons";

import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
} from "@lib/customStyles";
import { HeaderView, WallpaperContainer } from "@styles/appStyles";
import WallpaperItem from "@components/WallpaperItem";
import WallpaperPagination from "@components/WallpaperPagination";

const bucket = "prayse-wallpapers";
const URL = "https://doqbtuup6btvd.cloudfront.net/";

const Wallpapers = () => {
  const { colorScheme } = useColorScheme();

  const actualTheme = useSelector((state: any) => state.theme.actualTheme);
  // const [isDownloading, setIsDownloading] = useState(false);
  const [downloadHasStarted, setDownloadHasStarted] = useState(false);

  const wallpapersArray = [
    { id: 1, image: "1.png" },
    { id: 2, image: "2.png" },
    { id: 3, image: "3.png" },
    { id: 4, image: "4.png" },
    { id: 5, image: "5.png" },
    { id: 6, image: "6.png" },
    { id: 7, image: "7.png" },
    { id: 8, image: "8.png" },
    { id: 9, image: "9.png" },
    { id: 10, image: "11.png" },
  ];

  const handleDownloadPress = useCallback((imageKey: string) => {
    console.log("download");
    // setIsSwiperEnabled(false); // Disable swiper when download starts
    downloadImage(imageKey);
  }, []);

  const downloadImage = async (imageKey: string) => {
    // setIsSwiperEnabled(false); // Disable swiper when download starts

    try {
      setDownloadHasStarted(true);
      // setDownloadHasStarted((prev) => !prev);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant permission to save the image.",
        );
        return;
      }

      const imageRequest = JSON.stringify({
        bucket,
        key: imageKey,
        edits: {
          resize: {
            width: 1080,
            height: 1920,
            fit: "inside",
          },
        },
      });
      const encoded = Buffer.from(imageRequest).toString("base64");
      const s3Url = URL + encoded;
      const fileUri = FileSystem.documentDirectory + imageKey;
      const downloadResult = await FileSystem.downloadAsync(s3Url, fileUri);
      if (downloadResult.status === 200) {
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        await MediaLibrary.createAlbumAsync("Prayse wallpapers", asset, false);
        Alert.alert("Success", "Wallpaper saved to your gallery!");
      } else if (downloadResult.status === 413) {
        // If the image is too large, try to resize it
        const resizedImage = await manipulateAsync(
          s3Url,
          [{ resize: { width: 1080 } }],
          { format: SaveFormat.PNG },
        );
        const asset = await MediaLibrary.createAssetAsync(resizedImage.uri);
        await MediaLibrary.createAlbumAsync("Prayse wallpapers", asset, false);
        Alert.alert("Success", "Wallpaper resized and saved to your gallery!");
      } else {
        console.error("Download failed with status:", downloadResult.status);
        Alert.alert(
          "Error",
          `Failed to download the wallpaper. Status: ${downloadResult.status}`,
        );
      }
    } catch (error: any) {
      console.error("Error downloading image:", error);
      Alert.alert(
        "Error",
        `An error occurred while downloading the wallpaper: ${error.message}`,
      );
    } finally {
      setDownloadHasStarted(false);
    }
  };
  const [paginationIndex, setPaginationIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (
      viewableItems[0].index !== undefined &&
      viewableItems[0].index !== null
    ) {
      setPaginationIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  return (
    <WallpaperContainer
      style={getMainBackgroundColorStyle(actualTheme)}
      //@ts-ignore
      className="bg-light-background dark:bg-dark-background"
    >
      <HeaderView>
        <Link href="/pro">
          <View className="flex-row px-4 items-center justify-between gap-2">
            <AntDesign
              name="left"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : "white"
                  : actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-bold  font-inter dark:text-white text-light-primary text-center text-3xl"
            >
              Wallpapers
            </Text>
          </View>
        </Link>
      </HeaderView>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter-medium px-4 mb-3 text-light-primary dark:text-dark-primary"
      >
        Wallpapers will be changed with every update.
      </Text>
      <Animated.FlatList
        onScroll={onScrollHandler}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={wallpapersArray}
        pagingEnabled
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        renderItem={({ item, index }) => (
          <WallpaperItem
            item={item}
            index={index}
            scrollX={scrollX}
            actualTheme={actualTheme}
            colorScheme={colorScheme}
            handleDownloadPress={handleDownloadPress}
          />
        )}
      />
      <WallpaperPagination
        items={wallpapersArray}
        scrollX={scrollX}
        actualTheme={actualTheme}
        colorScheme={colorScheme}
        paginationIndex={paginationIndex}
      />
      {downloadHasStarted && (
        <View style={styles.downloadingOverlay}>
          <View style={styles.downloadingBox}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="font-inter-semibold text-white text-lg">
              Downloading, please wait...
            </Text>
          </View>
        </View>
      )}
    </WallpaperContainer>
  );
};

const styles = StyleSheet.create({
  downloadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    zIndex: 99,
    alignItems: "center",
  },
  downloadingBox: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  downloadingText: {
    color: "#ffffff",
    marginTop: 10,
    fontSize: 16,
  },
  downloadButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    padding: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
});

export default Wallpapers;
