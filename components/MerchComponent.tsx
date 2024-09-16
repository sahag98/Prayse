// @ts-nocheck
import React from "react";
import { Image } from "expo-image";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import {
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { posthog } from "@lib/posthog";

import pfeBlackBack from "../assets/merch/pfe-black-back.png";
import pfeBlackFront from "../assets/merch/pfe-black-front.png";
import pfeBlueBack from "../assets/merch/pfe-blue-back.png";
import pfeBlueFront from "../assets/merch/pfe-blue-front.png";
import prayseDefinition from "../assets/merch/prayse-definition.png";
// import pfeBlackFront from "../assets/merch/pfe-black-front.PNG";
// import pfeBlackFront from "../assets/merch/pfe-black-front.PNG";
// import pfeBlackFront from "../assets/merch/pfe-black-front.PNG";

interface MerchComponentProps {
  theme: string;
}

const blurhash = "JEI#ryj[IofR~qfj";

export const MerchComponent: React.FC<MerchComponentProps> = ({
  theme,
  actualTheme,
}) => {
  const merchImages = [pfeBlueBack, pfeBlueFront, pfeBlackBack, pfeBlackFront];
  return (
    <View
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      className="flex-1 dark:bg-dark-secondary bg-light-secondary mb-24 p-[10px] rounded-lg dark:border-[#474747] dark:border-2"
    >
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
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-xl dark:text-white text-light-primary"
          >
            Prayse Definition
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter font-normal mb-[10px] text-light-primary dark:text-[#bebebe]"
          >
            Reminding us of the power of prayer and praise in our walk with God.
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
              className="text-white dark:text-dark-background font-inter font-bold text-[15px]"
            >
              Check it Out
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
          source={prayseDefinition}
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
  );
};
