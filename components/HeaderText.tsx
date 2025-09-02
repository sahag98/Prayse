import { Text } from "react-native";
import React from "react";

const HeaderText = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <Text
      className={`font-inter-bold text-2xl text-light-primary dark:text-dark-primary ${className}`}
    >
      {text}
    </Text>
  );
};

export default HeaderText;
