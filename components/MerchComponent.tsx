// @ts-nocheck
import React from "react";
import { Image } from "expo-image";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";

import { AntDesign, Feather } from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { posthog } from "@lib/posthog";

import rejoicePrayPraise from "../assets/merch/rejoice-pray-praise.png";
import { ActualTheme } from "@types/reduxTypes";

interface MerchComponentProps {
  theme: string;
  actualTheme: ActualTheme;
}

const blurhash = "JEI#ryj[IofR~qfj";

export const MerchComponent: React.FC<MerchComponentProps> = ({
  theme,
  actualTheme,
}) => {
  //const merchImages = [pfeBlueBack, pfeBlueFront, pfeBlackBack, pfeBlackFront];
  return (
    <View
      style={
        actualTheme && actualTheme.PrimaryTxt && { borderTopColor: "gainsboro" }
      }
      className="border-t pt-3 mb-24 border-t-gray-300 dark:border-t-[#707070]"
    >
      <View className="flex-row items-center mb-4 gap-3">
        <Feather
          name="shopping-cart"
          size={20}
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : theme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-semibold mb-1 text-xl text-light-primary dark:text-dark-primary"
        >
          Merch
        </Text>
      </View>
      <View
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="dark:bg-dark-secondary bg-light-secondary mb-4 p-4 rounded-lg"
      >
        <View
          className="w-full justify-between items-center"
          style={{
            flexDirection: Platform.isPad ? "row" : "column",

            gap: Platform.isPad ? 30 : 10,
          }}
        >
          <View
            style={{
              width: Platform.isPad ? "auto" : "100%",
              gap: 5,
            }}
          >
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-bold text-xl dark:text-white text-light-primary"
            >
              Rejoice Pray Praise
            </Text>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-regular mb-[10px] text-light-primary dark:text-[#bebebe]"
            >
              Reminding us of the power of prayer and praise in our walk with
              God.
            </Text>

            <TouchableOpacity
              onPress={() => {
                Linking.openURL("https://shop.prayse.app/");
                posthog.capture("Shop now");
              }}
              className="dark:bg-dark-accent bg-light-primary justify-center items-center flex-row gap-[10px] p-3 rounded-lg"
              style={[
                getPrimaryBackgroundColorStyle(actualTheme),
                {
                  width: Platform.isPad ? "50%" : "100%",
                },
              ]}
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="text-white dark:text-dark-background font-inter-bold text-[15px]"
              >
                Shop Now
              </Text>
              <AntDesign
                name="shoppingcart"
                size={22}
                color={
                  actualTheme && actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : theme === "dark"
                      ? "#121212"
                      : "white"
                }
              />
            </TouchableOpacity>
          </View>
          <Image
            source={rejoicePrayPraise}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={500}
            style={{
              flex: 1,
              width: "100%",
              marginVertical: 10,
              borderRadius: 10,
              height: 350,
              aspectRatio: Platform.isPad ? 1 / 1 : null,
            }}
          />
        </View>
      </View>
    </View>
  );
};
