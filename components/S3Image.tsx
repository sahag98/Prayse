import React, { ComponentProps, useMemo, useState } from "react";
import { Buffer } from "buffer";
import { Image } from "expo-image";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ActualTheme } from "../types/reduxTypes";

const bucket = "prayse-wallpapers";
const URL = "https://doqbtuup6btvd.cloudfront.net/";

type S3ImageProps = {
  imgKey: string;
  theme: "light" | "dark" | undefined;
  actualTheme: ActualTheme;
} & Omit<ComponentProps<typeof Image>, "source">;

export default function S3Image({
  imgKey,
  style,
  theme,
  actualTheme,
  ...imageProps
}: S3ImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const uri = useMemo(() => {
    const imageRequest = JSON.stringify({
      bucket,
      key: imgKey,
      edits: {
        resize: {
          width: 400,
          height: 900,
          fit: "cover",
        },
      },
    });

    const encoded = Buffer.from(imageRequest).toString("base64");
    return URL + encoded;
  }, [imgKey]);

  return (
    <View style={[styles.container, style]}>
      {isLoading && (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : theme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      )}
      <Image
        source={{ uri }}
        {...imageProps}
        style={[styles.image, style]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
});
