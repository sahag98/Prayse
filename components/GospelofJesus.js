import React from "react";
import { Text, View } from "react-native";

import { Link } from "@react-navigation/native";

import { GOSPEL_SCREEN } from "../routes";

const GospelofJesus = ({ theme, colorScheme }) => {
  return (
    <Link to={`/${GOSPEL_SCREEN}`}>
      <View className="bg-white dark:bg-[#212121] mb-[15px] w-full p-[15px] rounded-lg gap-[15px]">
        <Text className="text-[#2f2d51] dark:text-[#d2d2d2] font-inter text-base font-medium">
          Gospel of Jesus
        </Text>
        <Text className="leading-6 font-inter font-bold text-[#2f2d51] dark:text-white text-xl">
          How can someone receive Jesus and get saved?
        </Text>
        <Text className="leading-6 underline font-inter font-normal text-base text-[#2f2d51] dark:text-[#a5c9ff]">
          Click here to learn more
        </Text>
      </View>
    </Link>
  );
};

export default GospelofJesus;
