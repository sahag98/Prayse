import React from "react";
import { Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

import { GOSPEL_SCREEN } from "../routes";

export const GospelOfJesus: React.FC = () => {
  return (
    <Link asChild href={`/${GOSPEL_SCREEN}`}>
      <TouchableOpacity className="bg-white dark:bg-dark-secondary mb-[15px] w-full p-[15px] rounded-lg gap-[15px]">
        <Text className="text-light-primary dark:text-[#d2d2d2] font-inter text-lg font-medium">
          Gospel of Jesus
        </Text>
        <Text className="leading-6 font-inter font-bold text-light-primary dark:text-white text-xl">
          How can someone receive Jesus and get saved?
        </Text>
        <Text className="leading-6 underline font-inter font-normal text-base text-light-primary dark:text-dark-accent">
          Click here to learn more
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
