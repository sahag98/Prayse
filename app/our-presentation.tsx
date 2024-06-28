// @ts-nocheck
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

import { Container } from "../styles/appStyles";

const OurPresentationScreen = () => {
  const theme = useSelector((state) => state.user.theme);

  const Message = [
    {
      id: 1,
      title: "GOD LOVES YOU",
      verse:
        "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
      chapter: "John 3:16",
    },
    {
      id: 2,
      title: "EVERYONE NEEDS A SAVIOR",
      verse: "For all have sinned, and come short of the glory of God.",
      chapter: "Romans 3:23",
    },
    {
      id: 3,
      title: "SIN HAS A PRICE THAT MUST BE PAID",
      verse:
        "For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.",
      chapter: "Romans 6:23",
    },
    {
      id: 4,
      title: "JESUS DIED TO PAY FOR YOUR SIN",
      verse:
        "But God commendeth his love towards us, in that, while we were yet sinners, Christ died for us.",
      chapter: "Romans 5:8",
    },
    {
      id: 5,
      title: "RECEIVE JESUS AS YOUR SAVIOUR",
      verse:
        "For whosoever shall call upon the name of the Lord shall be saved.",
      chapter: "Romans 10:13",
    },
  ];

  const Item = ({ title, verse, chapter }) => (
    <View style={styles.item}>
      <Text style={theme == "dark" ? styles.titleDark : styles.title}>
        {title}
      </Text>
      <Text style={theme == "dark" ? styles.verseDark : styles.verse}>
        "{verse}"
      </Text>
      <Text style={theme == "dark" ? styles.chapterDark : styles.chapter}>
        -{chapter}
      </Text>
    </View>
  );
  const renderItem = ({ item }) => (
    <Item title={item.title} verse={item.verse} chapter={item.chapter} />
  );
  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <FlatList
        data={Message}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Container>
  );
};

export default OurPresentationScreen;

const styles = StyleSheet.create({});
