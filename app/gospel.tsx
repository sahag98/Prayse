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
    <View
      style={
        actualTheme &&
        actualTheme.MainTxt && {
          borderBottomWidth: 1,
          borderBottomColor: actualTheme.MainTxt,
        }
      }
      className={`gap-1 ${title !== "RECEIVE JESUS AS YOUR SAVIOR" && "border-b"} border-b-light-primary dark:border-b-[#7b7b7b]`}
    >
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="dark:text-dark-primary pt-2 text-light-primary font-inter-bold text-2xl"
      >
        {title}
      </Text>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="dark:text-dark-primary mb-1 text-light-primary font-inter-semibold text-xl"
      >
        {content}
      </Text>

      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="dark:text-dark-primary text-light-primary font-inter-medium text-lg"
      >
        "{verse}"
      </Text>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="dark:text-dark-primary pb-2 self-end text-light-primary font-inter-semibold text-lg"
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
                  : colorScheme === "light"
                    ? "#2f2d51"
                    : "white"
              }
            />
          </TouchableOpacity>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-bold text-center text-3xl dark:text-dark-primary text-light-primary"
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
          <View className=" justify-center my-[10px]">
            <TouchableOpacity
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="w-full items-center justify-center dark:bg-dark-accent bg-light-primary p-4 rounded-lg"
              onPress={() => {
                setClearModalVisible(true);
              }}
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-center text-xl dark:text-dark-background text-white"
              >
                Pray
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
        <ModalContainer
          style={getMainBackgroundColorStyle(actualTheme)}
          className="bg-light-background dark:bg-dark-background"
        >
          <ModalView
            className="gap-2 w-[95%] bg-light-secondary dark:bg-dark-secondary"
            style={
              actualTheme && actualTheme.Secondary
                ? { backgroundColor: actualTheme.Secondary }
                : colorScheme === "dark"
                  ? { backgroundColor: "#212121" }
                  : { backgroundColor: "#b7d3ff" }
            }
          >
            <ModalIcon style={{ gap: 5 }}>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-center dark:text-dark-primary text-light-primary font-inter-bold text-2xl mb-3"
              >
                Pray this prayer
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="dark:text-dark-primary text-light-primary mb-2 text-center font-inter-regular text-lg"
              >
                Dear God, I recognize that I am a sinner and have been seperated
                from you. From this point on, I accept you Jesus as my Lord and
                Savior. Please forgive me from my sins and help me to surrender
                all areas my life to You.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="dark:text-dark-primary text-light-primary font-inter-medium text-lg"
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
                  className="dark:text-dark-background text-white font-inter-bold text-lg"
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

export default Gospel;
