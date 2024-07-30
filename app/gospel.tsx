// @ts-nocheck
import React, { useRef, useState } from "react";
import { useFonts } from "expo-font";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "@types/reduxTypes";

import {
  Container,
  HeaderView,
  ModalActionGroup2,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";

const Gospel = () => {
  const navigation = useNavigation();
  const theme = useSelector((state: any) => state.user.theme);
  const { colorScheme } = useColorScheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const Message = [
    {
      id: 1,
      title: "GOD LOVES YOU",
      content: "God loves you so much that He sent His only Son for you.",
      verse:
        "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      chapter: "John 3:16",
    },
    {
      id: 2,
      title: "EVERYONE NEEDS A SAVIOR",
      content: "We all sin and are in need of a savior from our sins.",
      verse: "For all have sinned, and come short of the glory of God.",
      chapter: "Romans 3:23",
    },
    {
      id: 3,
      title: "SIN HAS A PRICE THAT MUST BE PAID",
      content:
        "The penalty for sin is death but God promises us eternal life through Jesus!",
      verse:
        "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",
      chapter: "Romans 6:23",
    },
    {
      id: 4,
      title: "JESUS DIED TO PAY FOR YOUR SIN",
      content:
        "Instead of having every single one of us pay for our sins, Jesus died on the cross for us so that our sins can be forgiven!",
      verse:
        "But God commendeth his love towards us, in that, while we were yet sinners, Christ died for us.",
      chapter: "Romans 5:8",
    },
    {
      id: 5,
      title: "RECEIVE JESUS AS YOUR SAVIOR",
      content:
        "Simply take the next step by asking God to forgive you from your sins and receive Jesus as your personal Savior.",
      verse:
        "For whosoever shall call upon the name of the Lord shall be saved.",
      chapter: "Romans 10:13",
    },
  ];

  const Item = ({ title, verse, chapter, content }) => (
    <View className="gap-2 mb-5">
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="dark:text-dark-primary text-light-primary font-inter font-bold text-2xl"
      >
        {title}
      </Text>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="dark:text-dark-primary text-light-primary font-inter font-medium text-xl"
      >
        {content}
      </Text>

      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="dark:text-dark-primary text-light-primary font-inter font-semibold text-lg"
      >
        "{verse}"
      </Text>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="dark:text-[#b4b4b4] self-end text-light-primary font-inter font-semibold text-lg"
      >
        - {chapter}
      </Text>
    </View>
  );
  const renderItem = ({ item }) => (
    <Item
      title={item.title}
      verse={item.verse}
      chapter={item.chapter}
      content={item.content}
    />
  );

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      useNativeDriver: true,
      toValue: 1,
      duration: 2000,
    }).start();
  };
  fadeIn();

  const [clearModalVisible, setClearModalVisible] = useState(false);

  const handleCloseModal = () => {
    setClearModalVisible(false);
  };

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  const handleSubmit = () => {
    setClearModalVisible(false);
    Alert.alert(
      "Amen!! ",
      "Accepting Jesus as our Savior is the best decision we can make! Please contact us on Instagram @prayse.app so that we can celebrate this amazing decision with you.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Okay!",
          onPress: () =>
            Linking.openURL("https://www.instagram.com/prayse.app/"),
        },
      ],
    );
  };

  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
  });

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }
  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <View className="flex-row items-center justify-between">
        <HeaderView className="flex-row items-center gap-1">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back"
              size={30}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme == "light"
                    ? "#2f2d51"
                    : "white"
              }
            />
          </TouchableOpacity>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-bold text-center text-3xl dark:text-dark-primary text-light-primary"
          >
            Gospel
          </Text>
        </HeaderView>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Message}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={() => (
          <View className=" justify-center mb-[10px]">
            <TouchableOpacity
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="w-full items-center justify-center dark:bg-dark-accent bg-light-primary p-4 rounded-lg"
              onPress={() => {
                setClearModalVisible(true);
              }}
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-center text-xl dark:text-dark-background text-white"
              >
                Take Next Step
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent
        visible={clearModalVisible}
        onRequestClose={handleCloseModal}
      >
        <ModalContainer className="bg-light-background dark:bg-dark-background">
          <ModalView
            className="gap-2 w-[95%] bg-light-secondary dark:bg-dark-secondary"
            style={
              actualTheme && actualTheme.Secondary
                ? { backgroundColor: actualTheme.Secondary }
                : colorScheme == "dark"
                  ? { backgroundColor: "#212121" }
                  : { backgroundColor: "#b7d3ff" }
            }
          >
            <ModalIcon style={{ gap: 5 }}>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-center dark:text-dark-primary text-light-primary font-inter font-bold text-2xl mb-3"
              >
                Pray this Short Prayer
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="dark:text-dark-primary text-light-primary mb-2 font-inter font-normal text-lg"
              >
                Dear God, I recognize that I am a sinner and have been seperated
                from you. From this point on, I accept you Jesus as my Lord and
                Savior. Please forgive me from my sins and help me to surrender
                all areas my life to You.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="dark:text-dark-primary text-light-primary font-inter font-medium text-lg"
              >
                In Jesus' name I pray, Amen.
              </Text>
            </ModalIcon>
            <ModalActionGroup2>
              <TouchableOpacity
                style={getPrimaryBackgroundColorStyle(actualTheme)}
                className="dark:bg-dark-accent items-center bg-light-primary p-4 rounded-lg w-full"
                onPress={handleSubmit}
              >
                <Text
                  style={getPrimaryTextColorStyle(actualTheme)}
                  className="dark:text-dark-background text-white font-inter font-bold text-lg"
                >
                  Amen
                </Text>
              </TouchableOpacity>
            </ModalActionGroup2>
          </ModalView>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    color: "#2F2D51",
    textAlign: "center",

    fontFamily: "Inter-Bold",
  },

  headingDark: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "white",
    textAlign: "center",
  },

  fabStyle3: {
    bottom: 10,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    backgroundColor: "#2F2D51",
    width: 70,
  },
  fabStyle3Dark: {
    bottom: 10,
    borderRadius: 20,
    marginRight: 10,
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
    width: 70,
  },

  button: {
    alignSelf: "center",
    backgroundColor: "#2F2D51",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  buttonDark: {
    alignSelf: "center",
    backgroundColor: "#A5C9FF",
    padding: 15,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  started: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },

  startedDark: {
    color: "#080808",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Inter-Bold",
  },

  footer: {
    fontFamily: "Inter-Medium",
    fontSize: 15,
    color: "#2F2D51",
    textAlign: "center",
    padding: 10,
  },

  footerDark: {
    fontFamily: "Inter-Medium",
    fontSize: 15,
    color: "white",
    textAlign: "center",
    padding: 10,
  },

  footerContainer: {
    padding: 0,
  },

  footerDarkContainer: {
    padding: 0,
  },

  item: {
    gap: 10,
    marginBottom: 20,
  },

  title: {
    color: "#2f2d51",
    fontSize: 23,
    fontFamily: "Inter-Bold",
  },

  titleDark: {
    color: "white",
    fontSize: 23,
    fontFamily: "Inter-Bold",
  },

  prayTitle: {
    color: "#2f2d51",
    fontSize: 20,
    fontFamily: "Inter-Bold",
    paddingBottom: 5,
  },

  prayTitleDark: {
    color: "white",
    fontSize: 20,
    fontFamily: "Inter-Bold",
    textAlign: "center",
    paddingBottom: 5,
  },

  verse: {
    color: "#2f2d51",

    fontSize: 15,
    fontFamily: "Inter-Regular",
  },

  verseDark: {
    color: "#b4b4b4",

    fontSize: 15,
    fontFamily: "Inter-Regular",
  },
  content: {
    color: "#2f2d51",
    marginTop: 5,
    fontSize: 18,
    fontFamily: "Inter-Medium",
  },

  contentDark: {
    color: "white",
    marginTop: 5,
    fontSize: 18,
    fontFamily: "Inter-Medium",
  },

  pray: {
    color: "#2f2d51",
    lineHeight: 24,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },

  prayDark: {
    color: "white",
    lineHeight: 24,
    fontSize: 16,
    fontFamily: "Inter-Regular",
  },

  chapter: {
    alignSelf: "flex-end",
    color: "#2F2D51",
    fontSize: 15,
    fontFamily: "Inter-Medium",
  },

  chapterDark: {
    alignSelf: "flex-end",
    color: "white",
    fontSize: 15,
    fontFamily: "Inter-Medium",
  },
});

export default Gospel;
