// @ts-nocheck
import React from "react";
import { Link } from "expo-router";
import { View } from "react-native";
import { Badge } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";

import { NOTIFICATIONS_SCREEN } from "@routes";
import { ActualTheme } from "@types/reduxTypes";

interface NotificationActionProps {
  theme: string;
  actualTheme: ActualTheme;
}
export const NoticationAction: React.FC<NotificationActionProps> = ({
  theme,
  actualTheme,
}) => {
  const notis = useSelector((state) => state.noti.notifications);

  return (
    <View className="p-2 relative">
      <Link className="mt-1 " href={`/${NOTIFICATIONS_SCREEN}`}>
        <View className="p-2 rounded-md">
          <Ionicons
            name="notifications-outline"
            size={20}
            color={
              actualTheme.MainTxt
                ? actualTheme.MainTxt
                : theme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
        </View>
      </Link>
      <Badge
        size={15}
        style={{
          position: "absolute",
          fontFamily: "Inter-Medium",
          fontSize: 11,
          top: 8,
          right: 8,
        }}
      >
        {notis.length}
      </Badge>
    </View>
  );
};
