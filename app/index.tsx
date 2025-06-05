import React, { useEffect } from "react";

import { Redirect, useNavigation } from "expo-router";
import { Image } from "expo-image";
import { WELCOME_SCREEN } from "@routes";

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return <Redirect href={WELCOME_SCREEN} />;
}
