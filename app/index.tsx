import React from "react";
import { Redirect } from "expo-router";

import { WELCOME_SCREEN } from "@routes";

export default function HomeScreen() {
  return <Redirect href={WELCOME_SCREEN} />;
}
