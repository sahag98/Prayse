import React from "react";
import { Redirect } from "expo-router";

import { WELCOME_SCREEN } from "@routes";

export default function HomeScreen() {
  // const rootNavigationState = useRootNavigationState();

  // if (!rootNavigationState?.key) return null;
  return <Redirect href={WELCOME_SCREEN} />;
}
