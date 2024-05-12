import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Container } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { format } from "date-fns";
import { useIsFocused } from "@react-navigation/native";

const RoadMap = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const [roadmap, setRoadmap] = useState([]);

  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchRoadMap() {
      const roadmapItems = await fetch(
        `https://projectplannerai.com/api/roadmap?projectId=j576dgzhs2esx5xr7cb0arvch56rqmfp`
      ).then(async (res) => res.json());

      setRoadmap(roadmapItems);
    }
    fetchRoadMap();
  }, [isFocused]);

  console.log("roadmap: ", roadmap);
  return (
    <Container
      style={{ backgroundColor: theme == "dark" ? "#121212" : "#f2f7ff" }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("More")}>
        <AntDesign
          name="left"
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </TouchableOpacity>
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

      <FlatList
        keyExtractor={(e, i) => i.toString()}
        data={roadmap}
        renderItem={({ item }) => {
          return (
            <View key={item.id}>
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
                    fontSize: 18,
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

              <View>
                <View></View>
                <View />
              </View>
              <View>
                <View>
                  <View>
                    <Text
                      style={{
                        color: theme == "dark" ? "white" : "#2f2d51",
                        fontSize: 16,
                        fontFamily: "Inter-Medium",
                      }}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                        fontFamily: "Inter-Regular",
                      }}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </Container>
  );
};

export default RoadMap;

const styles = StyleSheet.create({});
