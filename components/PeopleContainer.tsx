import React from "react";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";

export const PeopleContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { colorScheme } = useColorScheme();

  console.log(colorScheme);

  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      className="px-4"
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
      }}
    >
      {children}
    </SafeAreaView>
  );
};

// const styles = {
//   container: "bg-red-300 flex-1",
// };
