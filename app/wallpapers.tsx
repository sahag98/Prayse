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
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-swiper";
import { useSelector } from "react-redux";

import S3Image from "@components/S3Image";

import { AntDesign } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
} from "@lib/customStyles";
import { Container, HeaderView } from "@styles/appStyles";

const bucket = "prayse-wallpapers";
const URL = "https://doqbtuup6btvd.cloudfront.net/";

const Wallpapers = () => {
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector((state: any) => state.theme.actualTheme);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSwiperEnabled, setIsSwiperEnabled] = useState(true);

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
    setIsSwiperEnabled(false); // Disable swiper when download starts
    downloadImage(imageKey);
  }, []);

  const downloadImage = async (imageKey: string) => {
    setIsDownloading(true);
    setIsSwiperEnabled(false); // Disable swiper when download starts
    try {
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
      setIsDownloading(false);
      setIsSwiperEnabled(true); // Re-enable swiper when download finishes
    }
  };

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      //@ts-ignore
      className="bg-light-background dark:bg-dark-background"
    >
      <HeaderView>
        <Link href="/pro">
          <View className="flex-row items-center justify-between gap-2">
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
              className="font-bold font-inter dark:text-white text-light-primary text-center text-3xl"
            >
              Wallpapers
            </Text>
          </View>
        </Link>
      </HeaderView>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter-medium mb-3 text-light-primary dark:text-dark-primary"
      >
        Wallpapers will be changed with every update.
      </Text>
      <Swiper
        dotColor="grey"
        showsButtons
        scrollEnabled={isSwiperEnabled}
        loop={false}
      >
        {wallpapersArray.map((item) => (
          <View
            key={item.id}
            className="flex-1 rounded-2xl overflow-hidden justify-center items-center"
            testID="Hello"
          >
            <S3Image
              imgKey={item.image}
              theme={colorScheme}
              actualTheme={actualTheme}
              style={{ width: "100%", height: "100%" }}
              className="w-full h-full"
            />
            <TouchableOpacity
              onPress={() => handleDownloadPress(item.image)}
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="absolute bg-light-primary dark:bg-dark-accent border border-gray-100 bottom-4 left-4 p-4 rounded-full"
              disabled={isDownloading}
            >
              <Feather
                name="download"
                size={40}
                color={
                  actualTheme && actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : colorScheme === "dark"
                      ? "#121212"
                      : "f2f7ff"
                }
              />
            </TouchableOpacity>
          </View>
        ))}
      </Swiper>
      {isDownloading && (
        <View style={styles.downloadingOverlay}>
          <View style={styles.downloadingBox}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text className="font-inter-semibold text-white text-lg">
              Downloading, please wait...
            </Text>
          </View>
        </View>
      )}
    </Container>
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
});

export default Wallpapers;
