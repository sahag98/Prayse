import React, { useEffect } from "react";

import { Redirect, useNavigation } from "expo-router";
import { FOLDER_SCREEN } from "@routes";

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return <Redirect href={FOLDER_SCREEN} />;
}
