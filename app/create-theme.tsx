//@ts-nocheck
import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ColorPanel from "@components/ColorPanel";
import TextColorPanel from "@components/TextColorPanel";

import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { resetTheme, setTheme } from "@redux/themeReducer";
import { YOUR_THEMES_SCREEN } from "@routes";

const CreateThemeScreen = () => {
  const { colorScheme } = useColorScheme();
  const customBg = useSelector((state) => state.theme.customBg);
  const customPrimary = useSelector((state) => state.theme.customPrimary);
  const customPrimaryTxt = useSelector((state) => state.theme.customPrimaryTxt);
  const customSecondary = useSelector((state) => state.theme.customSecondary);
  const customSecondaryTxt = useSelector(
    (state) => state.theme.customSecondaryTxt,
  );

  const customMainTxt = useSelector((state) => state.theme.customMainTxt);

  const dispatch = useDispatch();

  return (
    <View
      // style={Bg && { backgroundColor: Bg }}
      className="flex relative py-20 flex-1 dark:bg-[#121212] bg-[#f2f7ff]"
      // showsVerticalScrollIndicator={false}
      // contentContainerStyle={{ flex: 1 }}
    >
      <View>
        <Link href="/pro">
          <View className="flex-row items-center justify-between gap-2">
            <AntDesign
              name="left"
              size={24}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
            <Text className="font-bold font-inter dark:text-white text-light-primary text-center text-3xl">
              Create Theme
            </Text>
          </View>
        </Link>
      </View>
      <View className="flex-1 justify-between">
        <View>
          <Text className="font-inter text-xl mb-3 font-medium">Example</Text>
          <View
            style={customBg && { backgroundColor: customBg }}
            className="border bg-[#f2f7ff] dark:bg-[#121212] gap-3 mb-3 p-3 h-fit rounded-lg"
          >
            <Text
              style={customMainTxt && { color: customMainTxt ?? "" }}
              className="font-inter text-lg text-center text-light-primary dark:text-white font-medium"
            >
              Main Text
            </Text>
            <View
              style={
                customPrimary && {
                  backgroundColor: customPrimary ? customPrimary : null,
                }
              }
              className="p-5 bg-light-primary dark:bg-dark-accent rounded-lg border"
            >
              <Text
                style={customPrimaryTxt && { color: customPrimaryTxt ?? "" }}
                className="font-inter text-white dark:text-dark-secondary font-medium"
              >
                Primary Box/Button
              </Text>
            </View>

            <View
              style={
                customSecondary && {
                  backgroundColor: customSecondary ? customSecondary : null,
                }
              }
              className="p-5 bg-light-secondary dark:bg-dark-secondary rounded-lg border"
            >
              <Text
                style={
                  customSecondaryTxt && {
                    color: customSecondaryTxt ? customSecondaryTxt : null,
                  }
                }
                className="font-inter text-light-primary dark:text-dark-primary font-medium"
              >
                Secondary Box/Button
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <Text className="font-inter text-primary dark:text-white font-medium text-xl">
              Background Color
            </Text>
            <FontAwesome6
              name="brush"
              size={20}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
          </View>

          <View className="gap-3 mt-3">
            <ColorPanel type="mainbg" title="Change main background color" />
            <View className="flex-row gap-3 w-full">
              <ColorPanel type="primarybg" title="Change primary color" />
              <ColorPanel type="secondarybg" title="Change secondary color" />
            </View>
          </View>
          <View className="flex-row items-center mt-3 gap-3">
            <Text className="font-inter text-primary dark:text-white font-medium text-xl">
              Text Color
            </Text>
            <FontAwesome6
              name="brush"
              size={20}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
          </View>

          <View className="gap-3 my-3">
            <TextColorPanel type="maintxt" title="Change Main text color" />
            <View className="flex-row gap-3 w-full">
              <TextColorPanel
                type="primarytxt"
                title="Change Primary text color"
              />
              <TextColorPanel
                type="secondarytxt"
                title="Change Secondary text color"
              />
            </View>
          </View>
        </View>
        <View className="w-full mt-1 gap-2">
          <Link asChild href={`/${YOUR_THEMES_SCREEN}`}>
            <TouchableOpacity
              onPress={() => {
                dispatch(setTheme());
              }}
              className="w-full p-5 bg-light-primary dark:bg-dark-accent justify-center items-center rounded-lg"
            >
              <Text className="text-white font-inter text-base font-bold dark:text-dark-secondary">
                Save and Apply
              </Text>
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            className="w-full p-5 bg-red-500 justify-center items-center rounded-lg"
            onPress={() => dispatch(resetTheme())}
          >
            <Text className="text-white font-inter text-base font-bold dark:text-dark-secondary">
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CreateThemeScreen;
