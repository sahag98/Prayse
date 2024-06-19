import React, { useRef, useState } from "react";
import { useFonts } from "expo-font";
import { useNavigation } from "expo-router";
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
  Container,
  HeaderView,
  ModalAction2,
  ModalActionGroup2,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";

const GospelScreen = () => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.user.theme);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const Message = [
    {
      id: 1,
      title: "GOD LOVES YOU",
      content:
        "Friend, God loves you so much that He sent His only Son for you.",
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
    <View style={styles.item}>
      <View>
        <Text style={theme == "dark" ? styles.titleDark : styles.title}>
          {title}
        </Text>
        <Text style={theme == "dark" ? styles.contentDark : styles.content}>
          {content}
        </Text>
      </View>
      <Text style={theme == "dark" ? styles.verseDark : styles.verse}>
        "{verse}"
      </Text>
      <Text style={theme == "dark" ? styles.chapterDark : styles.chapter}>
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
      style={
        theme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <HeaderView
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back"
              size={30}
              color={theme == "light" ? "#2f2d51" : "white"}
            />
          </TouchableOpacity>
          <Text style={theme == "dark" ? styles.headingDark : styles.heading}>
            Gospel
          </Text>
        </HeaderView>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={Message}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={() => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              style={theme == "dark" ? styles.buttonDark : styles.button}
              title="Create a prayer list"
              onPress={() => {
                setClearModalVisible(true);
              }}
            >
              <Text
                style={theme == "dark" ? styles.startedDark : styles.started}
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
        <ModalContainer
          style={
            theme == "dark"
              ? { backgroundColor: "#121212" }
              : { backgroundColor: "#F2F7FF" }
          }
        >
          <ModalView
            style={
              theme == "dark"
                ? { backgroundColor: "#212121", gap: 5, width: "95%" }
                : { backgroundColor: "#b7d3ff", gap: 5, width: "95%" }
            }
          >
            <ModalIcon style={{ gap: 5 }}>
              <Text
                style={
                  theme == "dark" ? styles.prayTitleDark : styles.prayTitle
                }
              >
                Pray this Short Prayer
              </Text>
              <Text style={theme == "dark" ? styles.prayDark : styles.pray}>
                Dear God, I recognize that I am a sinner and have been seperated
                from you. From this point on, I accept you Jesus as my Lord and
                Savior. Please forgive me from my sins and help me to surrender
                all areas my life to You.
              </Text>
              <Text
                style={
                  theme == "dark"
                    ? [styles.prayDark, { fontFamily: "Inter-Medium" }]
                    : [styles.pray, { fontFamily: "Inter-Medium" }]
                }
              >
                In Jesus' name I pray, Amen.
              </Text>
            </ModalIcon>
            <ModalActionGroup2>
              {/* <ModalAction2
                color={theme == "dark" ? "#121212" : ""}
                onPress={handleCloseModal}
              >
                <Text style={{ color: "white" }}>Not ready yet</Text>
              </ModalAction2> */}
              <ModalAction2
                style={{ width: "100%" }}
                color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
                onPress={handleSubmit}
              >
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "#121212",
                          fontSize: 15,
                          fontFamily: "Inter-Bold",
                        }
                      : {
                          color: "white",
                          fontSize: 15,
                          fontFamily: "Inter-Bold",
                        }
                  }
                >
                  Just prayed that!
                </Text>
              </ModalAction2>
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

export default GospelScreen;
