import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import useStore from "@hooks/store";
import { Link } from "expo-router";
import { WELCOME_SCREEN } from "@routes";
import { ContributionGraph } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { ActualTheme } from "../../types/reduxTypes";
import { getMainTextColorStyle } from "@lib/customStyles";

const understandInfo = [
  {
    id: 1,
    title: "1. Column = Weeks",
    items: [
      "Each column represents a full week.",
      "The further right you go, the more recent the week.",
    ],
  },
  {
    id: 2,
    title: "2. Row = Days of the Week",
    items: [
      "Each row represents a day of the week (e.g., Mon-Sun).",
      "The top row is Monday, the bottom row is Sunday.",
    ],
  },
  {
    id: 3,
    title: "3. Squares = Prayer Activity",
    items: [
      "Each square represents a day.",
      "The color of the square is determined whether you prayed on that day or not.",
    ],
  },
];

const TrackingScreen = () => {
  //   const data = generateMockData();
  const prayers = useStore((state) => state.prayers);
  const verseoftheday = useStore((state) => state.verseoftheday);
  // console.log(prayers);
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );

  const { colorScheme } = useColorScheme();

  const chartConfig = {
    backgroundGradientFrom: colorScheme === "dark" ? "#525151" : "#ffff",
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: colorScheme === "dark" ? "#525151" : "#ffff",
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) =>
      colorScheme === "dark"
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(47, 45, 81, ${opacity})`,
  };

  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
          flex: 1,
          padding: 10,
        },
      ]}
    >
      <View>
        <Link className="items-center" asChild href={`/${WELCOME_SCREEN}`}>
          <Pressable>
            <Ionicons
              name="chevron-back"
              size={30}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "light"
                    ? "#2f2d51"
                    : "white"
              }
            />
          </Pressable>
        </Link>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <View className="border p-4 bg-light-secondary dark:bg-dark-secondary rounded-xl gap-3">
            <Text className="font-inter-bold text-lg text-light-primary dark:text-dark-primary">
              Prayer Tracking
            </Text>
            <Text className="font-inter-medium text-light-primary mb-2 dark:text-dark-primary">
              Scroll horizontally to see the weeks and days you have prayed on.
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-1 overflow-hidden">
                <ContributionGraph
                  tooltipDataAttrs={() => ({})}
                  values={prayers}
                  endDate={new Date()}
                  numDays={102}
                  width={Dimensions.get("window").width}
                  showOutOfRangeDays
                  // numDays={365}

                  gutterSize={2}
                  squareSize={15}
                  height={180}
                  chartConfig={chartConfig}
                />
              </View>
            </ScrollView>
          </View>
          <View className="border p-4 bg-light-secondary dark:bg-dark-secondary rounded-xl gap-3">
            <Text className="font-inter-bold text-lg text-light-primary dark:text-dark-primary">
              Verse of the Day Tracking
            </Text>
            <Text className="font-inter-medium text-light-primary mb-2 dark:text-dark-primary">
              Scroll horizontally to see the weeks and days you read the verse
              of the day.
            </Text>
            <ScrollView
              // ref={scrollViewRef}

              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <View className="flex-1 overflow-hidden">
                <ContributionGraph
                  tooltipDataAttrs={() => ({})}
                  values={verseoftheday}
                  endDate={new Date()}
                  numDays={102}
                  width={Dimensions.get("window").width}
                  showOutOfRangeDays
                  // numDays={365}

                  gutterSize={2}
                  squareSize={15}
                  height={180}
                  chartConfig={chartConfig}
                />
              </View>
            </ScrollView>
          </View>
        </View>

        <View className="gap-3 mt-3">
          <View>
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-semibold text-light-primary dark:text-dark-primary text-xl"
            >
              How To Understand this Tracking Graph
            </Text>
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
            >
              Here it is:
            </Text>
          </View>
          <View className="gap-3">
            {understandInfo.map((info) => (
              <View className="border rounded-lg p-3" key={info.id}>
                <Text className="font-inter-medium text-lg text-light-primary dark:text-dark-primary">
                  {info.title}
                </Text>
                {info.items.map((item, index) => (
                  <Text
                    key={index}
                    className="font-inter-regular text-light-primary dark:text-dark-primary"
                  >
                    - {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackingScreen;
