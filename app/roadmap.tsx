// @ts-nocheck
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import { Link, useIsFocused } from "@react-navigation/native";

import { MORE_SCREEN } from "../routes";
import { Container } from "../styles/appStyles";

const RoadMapScreen = () => {
  const theme = useSelector((state) => state.user.theme);
  const [roadmap, setRoadmap] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchRoadMap() {
      try {
        setIsLoading(true);
        const roadmapItems = await fetch(
          `https://projectplannerai.com/api/roadmap?projectId=j576dgzhs2esx5xr7cb0arvch56rqmfp`,
        ).then(async (res) => res.json());

        setRoadmap(roadmapItems);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoadMap();
  }, [isFocused]);

  console.log("roadmap: ", roadmap);
  return (
    <Container
      style={{ backgroundColor: theme == "dark" ? "#121212" : "#f2f7ff" }}
    >
      <Link to={`/${MORE_SCREEN}`}>
        <AntDesign
          name="left"
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </Link>
      <Text
        style={{
          color: theme == "dark" ? "white" : "#2f2d51",
          fontFamily: "Inter-Bold",
          textAlign: "center",
          fontSize: 18,
          marginBottom: 20,
        }}
      >
        RoadMap of App Updates
      </Text>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color="white" />
        </View>
      ) : (
        <FlatList
          keyExtractor={(e, i) => i.toString()}
          data={roadmap}
          renderItem={({ item }) => {
            return (
              <View style={{ gap: 5 }} key={item.id}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: theme == "dark" ? "white" : "#2f2d51",
                      fontFamily: "Inter-Bold",
                      fontSize: 24,
                    }}
                  >
                    {item.version}
                  </Text>
                  <Text
                    style={{
                      color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                      fontFamily: "Inter-Regular",
                    }}
                  >
                    {format(item.releaseDate, "PP")}
                  </Text>
                </View>

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      color: theme == "dark" ? "white" : "#2f2d51",
                      fontSize: 18,
                      fontFamily: "Inter-Medium",
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={{
                      color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                      fontFamily: "Inter-Regular",
                      lineHeight: 23,
                      fontSize: 15,
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </Container>
  );
};

export default RoadMapScreen;

const styles = StyleSheet.create({});
