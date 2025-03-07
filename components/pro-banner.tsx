import React, { useEffect } from "react";
import { router } from "expo-router";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import Purchases from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { AntDesign } from "@expo/vector-icons";
import {
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
} from "@lib/customStyles";
import { PRO_SCREEN } from "@routes";
import { useDispatch } from "react-redux";
import { showProModal } from "@redux/userReducer";

// Purchases.setLogLevel(Purchases.LOG_LEVEL.VERBOSE);

interface ProBannerProps {
  theme: string;
  actualTheme: {
    Accent: string;
    AccentTxt: string;
    Bg: string;
    MainTxt: string;
    Primary: string;
    PrimaryTxt: string;
    Secondary: string;
    SecondaryTxt: string;
    id: string;
  };
}
export const ProBanner: React.FC<ProBannerProps> = ({ theme, actualTheme }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (Platform.OS === "ios") {
      if (!process.env.EXPO_PUBLIC_RC_IOS) {
        Alert.alert("Error configuring RC: IOS api key undefined");
      } else {
        Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_IOS });
      }
    } else if (Platform.OS === "android") {
      if (!process.env.EXPO_PUBLIC_RC_ANDROID) {
        Alert.alert("Error configuring RC: ANDROID api key undefined");
      } else {
        Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_RC_ANDROID });
      }
    }

    //test fetching RC products
    // Purchases.getOfferings().then(console.log).catch(console.log);
  }, []);

  const isSubscribed = async () => {
    const paywallResult: PAYWALL_RESULT =
      await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "pro",
      });

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
        return true;
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  };

  async function subscribeToPro() {
    dispatch(showProModal());
    if (await isSubscribed()) {
      router.push(`/${PRO_SCREEN}`);
    }
  }

  return (
    <TouchableOpacity
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      onPress={subscribeToPro}
      className="w-full mb-5 mt-1 flex-row items-center justify-between p-5 rounded-lg bg-light-secondary dark:bg-dark-accent"
    >
      <View className="flex-row items-center gap-3">
        <MaterialCommunityIcons
          name="crown-outline"
          size={24}
          color={
            actualTheme && actualTheme.PrimaryTxt
              ? actualTheme.PrimaryTxt
              : theme === "dark"
                ? "#121212"
                : "#2f2d51"
          }
        />
        <Text
          style={getPrimaryTextColorStyle(actualTheme)}
          className="font-inter-bold text-lg dark:text-dark-background text-light-primary"
        >
          Upgrade to Pro
        </Text>
      </View>
      <AntDesign
        name="right"
        size={24}
        color={
          actualTheme && actualTheme.PrimaryTxt
            ? actualTheme.PrimaryTxt
            : theme === "dark"
              ? "#121212"
              : "#2f2d51"
        }
      />
    </TouchableOpacity>
  );
};
