import React from "react";
import { Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

import { GOSPEL_SCREEN } from "../routes";

export const GospelOfJesus: React.FC = () => {
  return (
    <Link asChild href={`/${GOSPEL_SCREEN}`}>
      <TouchableOpacity className="bg-white dark:bg-[#212121] mb-[15px] w-full p-[15px] rounded-lg gap-[15px]">
        <Text className="text-[#2f2d51] dark:text-[#d2d2d2] font-inter text-lg font-medium">
          Gospel of Jesus
        </Text>
        <Text className="leading-6 font-inter font-bold text-[#2f2d51] dark:text-white text-xl">
          How can someone receive Jesus and get saved?
        </Text>
        <Text className="leading-6 underline font-inter font-normal text-base text-[#2f2d51] dark:text-[#a5c9ff]">
          Click here to learn more
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
