// @ts-nocheck
import React from "react";
import {
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

import merch from "../assets/merch.png";

interface MerchComponentProps {
  theme: string;
}
export const MerchComponent: React.FC<MerchComponentProps> = ({ theme }) => {
  return (
    <View className="flex-1 dark:bg-[#212121] bg-[#b7d3ff] mb-4 p-[10px] rounded-lg dark:border-[#474747] dark:border-2">
      <View
        className="w-full justify-between items-center flex-1"
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
          <Text className="font-inter font-bold text-lg dark:text-white text-[#2f2d51]">
            Prayse Merch
          </Text>
          <Text className="font-inter font-normal mb-[10px] text-[#2f2d51] dark:text-[#bebebe]">
            Reminding us of the power of prayer and praise in our walk with God.
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://shop.prayse.app/")}
            className="dark:bg-[#a5c9ff] bg-[#2f2d51] justify-center items-center flex-row gap-[10px] p-3 rounded-lg"
            style={{
              width: Platform.isPad ? "50%" : "100%",
            }}
          >
            <Text className="text-white dark:text-[#121212] font-inter font-bold text-[15px]">
              Shop Now
            </Text>
            <AntDesign
              name="shoppingcart"
              size={22}
              color={theme === "dark" ? "#121212" : "white"}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={merch}
          style={{
            flex: 1,
            width: "100%",
            height: 350,
            aspectRatio: Platform.isPad ? 1 / 1 : null,
          }}
        />
      </View>
    </View>
  );
};
