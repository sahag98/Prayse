// @ts-nocheck
import React from "react";
import { Link } from "expo-router";
import { View } from "react-native";
import { Badge } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

import { NOTIFICATIONS_SCREEN } from "@routes";

interface NotificationActionProps {
  theme: string;
}
export const NoticationAction: React.FC<NotificationActionProps> = ({
  theme,
}) => {
  const notis = useSelector((state) => state.noti.notifications);

  return (
    <View className="p-[8px] relative">
      <Link className=" mt-1 " href={`/${NOTIFICATIONS_SCREEN}`}>
        <View className="p-[8px] rounded-md">
          <Ionicons
            name="notifications-outline"
            size={20}
            color={theme === "dark" ? "white" : "#2f2d51"}
          />
        </View>
      </Link>
      <Badge
        size={14}
        style={{
          position: "absolute",
          fontFamily: "Inter-Medium",
          fontSize: 11,
          top: 10,
          right: 8,
        }}
      >
        {notis.length}
      </Badge>
    </View>
  );
};
