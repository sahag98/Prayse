import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView edges={["top"]} className="">
      {children}
    </SafeAreaView>
  );
};

const styles = {
  container: "flex p-5 bg-red-300 dark:bg-dark-background flex-1",
};
