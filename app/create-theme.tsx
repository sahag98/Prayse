// @ts-nocheck
import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ColorPanel from "@components/ColorPanel";
import TextColorPanel from "@components/TextColorPanel";

import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { resetTheme, setTheme } from "@redux/themeReducer";
import { HeaderView, WelcomeContainer } from "@styles/appStyles";

const CreateThemeScreen = () => {
  const { colorScheme } = useColorScheme();
  const customBg = useSelector((state) => state.theme.customBg);
  const customPrimary = useSelector((state) => state.theme.customPrimary);
  const customPrimaryTxt = useSelector((state) => state.theme.customPrimaryTxt);
  const customSecondary = useSelector((state) => state.theme.customSecondary);
  const customSecondaryTxt = useSelector(
    (state) => state.theme.customSecondaryTxt,
  );

  const Bg = useSelector((state) => state.theme.Bg);
  const Primary = useSelector((state) => state.theme.Primary);
  const PrimaryTxt = useSelector((state) => state.theme.PrimaryTxt);
  const Secondary = useSelector((state) => state.theme.Secondary);
  const SecondaryTxt = useSelector((state) => state.theme.SecondaryTxt);

  const dispatch = useDispatch();

  return (
    <WelcomeContainer
      style={Bg && { backgroundColor: Bg }}
      className="flex relative flex-1 dark:bg-[#121212] bg-[#f2f7ff]"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
    >
      <HeaderView>
        <Link href="/">
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
      </HeaderView>
      <View className="flex-1 justify-between">
        <View>
          <Text className="font-inter text-lg mb-2 font-medium">Example</Text>
          <View
            style={customBg && { backgroundColor: customBg }}
            className="border bg-[#f2f7ff] dark:bg-[#121212] gap-3 mb-3 p-5 h-fit rounded-lg"
          >
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
                style={customSecondaryTxt && { color: customSecondaryTxt }}
                className="font-inter text-light-primary dark:text-dark-primary font-medium"
              >
                Secondary Box/Button
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <Text className="font-inter text-primary dark:text-white font-medium text-lg">
              Background Color
            </Text>
            <FontAwesome6
              name="brush"
              size={20}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
          </View>

          <View className="gap-3 mt-2">
            <ColorPanel type="mainbg" title="Change main background color" />
            <View className="flex-row gap-3 w-full">
              <ColorPanel
                type="primarybg"
                title="Change primary background color"
              />
              <ColorPanel
                type="secondarybg"
                title="Change secondary background color"
              />
            </View>

            {/* <ColorPanel title="Change text color" /> */}
          </View>
          <View className="flex-row items-center mt-3 gap-3">
            <Text className="font-inter text-primary dark:text-white font-medium text-lg">
              Text Color
            </Text>
            <FontAwesome6
              name="brush"
              size={20}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
          </View>

          <View className="gap-3 mt-2">
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
        <View className="w-full gap-2">
          <TouchableOpacity
            onPress={() => dispatch(setTheme())}
            className="w-full p-5 bg-light-primary dark:bg-dark-accent justify-center items-center rounded-lg"
          >
            <Text className="text-white font-inter text-base font-bold dark:text-dark-secondary">
              Save and Apply
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full p-5 bg-red-500 justify-center items-center rounded-lg"
            onPress={() => dispatch(resetTheme())}
          >
            <Text className="text-white font-inter text-base font-bold dark:text-dark-secondary">
              {" "}
              Reset
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </WelcomeContainer>
  );
};

export default CreateThemeScreen;
