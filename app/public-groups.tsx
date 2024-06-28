// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { Link, useIsFocused } from "@react-navigation/native";

import groupBg from "../assets/group-bg.png";
import { useSupabase } from "../context/useSupabase";
import { COMMUNITY_SCREEN } from "../routes";
import { Container, HeaderTitle } from "../styles/appStyles";

const PublicGroupsScreen = () => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.user.theme);
  const { publicGroups, currentUser, supabase } = useSupabase();
  const [search, setSearch] = useState("");
  const isFocused = useIsFocused();
  const [groups, setGroups] = useState([]);

  async function getGroupUsers() {
    const { data: groups, error } = await supabase
      .from("members")
      .select("*,groups(*), profiles(*)")
      .order("id", { ascending: true });
    setGroups(groups);
  }
  const list = publicGroups.filter((item) =>
    search !== "" ? item.name.includes(search) : true,
  );

  useEffect(() => {
    getGroupUsers();
  }, [isFocused]);

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const joinGroup = async (code) => {
    if (code.length <= 0) {
      showToast("error", "The group name field can't be empty.");
      setModalVisible(false);
    } else {
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .select("code, id")
        .eq("code", code);

      if (group.length == 0) {
      } else if (group.length > 0) {
        const { data: members, error } = await supabase
          .from("members")
          .select("*")
          .eq("group_id", group[0].id)
          .eq("user_id", currentUser.id);

        if (members.length > 0) {
          showToast("error", "You have already joined this group.");
          console.log("You have already joined this group.");
        } else {
          console.log(`Joining group${group[0].code}`);
          const { data, error } = await supabase.from("members").insert({
            group_id: group[0].id,
            user_id: currentUser.id,
          });
          showToast("success", "Prayer group joined successfully.");
          navigation.navigate(COMMUNITY_SCREEN);
        }
      }
    }
  };

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
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
          gap: 10,
        }}
      >
        <Link to={`/${COMMUNITY_SCREEN}`}>
          <AntDesign
            name="left"
            size={24}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
        </Link>

        <HeaderTitle
          style={
            theme == "dark"
              ? { color: "white", fontSize: 22, fontFamily: "Inter-Bold" }
              : { color: "#2f2d51", fontSize: 22, fontFamily: "Inter-Bold" }
          }
        >
          Public Groups
        </HeaderTitle>
      </View>
      <View
        style={{
          backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
          marginBottom: 10,
          padding: 12,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TextInput
          value={search}
          style={{
            color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
            width: "75%",
          }}
          placeholder="Search for public groups..."
          placeholderTextColor={theme == "dark" ? "#d2d2d2" : "#2f2d51"}
          selectionColor={theme == "dark" ? "white" : "#2f2d51"}
          onChangeText={(text) => setSearch(text)}
          autoFocus={false}
        />
        <EvilIcons
          onPress={() => Keyboard.dismiss()}
          name="search"
          size={24}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>

      {list.length == 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Medium",
            }}
          >
            Group doesn't exist... Try again
          </Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(e, i) => i.toString()}
          initialNumToRender={30}
          contentContainerStyle={{ gap: 10 }}
          ListHeaderComponentStyle={{ marginVertical: 10 }}
          ListHeaderComponent={() => {
            return (
              <View style={{ gap: 5 }}>
                <Text
                  style={{
                    color: theme == "dark" ? "white" : "#2f2d51",
                    fontFamily: "Inter-Medium",
                    fontSize: 17,
                  }}
                >
                  List of Public Groups
                </Text>
                <Text
                  style={{
                    color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                    fontFamily: "Inter-Regular",
                  }}
                >
                  Click on one to join!
                </Text>
              </View>
            );
          }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => joinGroup(item.code)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
                  borderRadius: 10,
                  padding: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={
                      item.group_img
                        ? {
                            uri: item.group_img,
                          }
                        : groupBg
                    }
                    style={
                      item.group_img
                        ? {
                            width: 70,
                            height: 70,
                            borderRadius: 10,
                          }
                        : {
                            tintColor: theme == "dark" ? "white" : "#d1e3ff",
                            backgroundColor:
                              theme == "dark" ? "#121212" : "white",
                            borderRadius: 10,
                            width: 70,
                            height: 70,
                          }
                    }
                  />
                  <View
                    style={{
                      justifyContent: "space-between",

                      gap: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: theme == "dark" ? "white" : "#2f2d51",
                        fontFamily: "Inter-Bold",
                        fontSize: 17,
                      }}
                    >
                      {item.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      {groups
                        .filter((g) => g.group_id === item.id)
                        .slice(0, 3) // Show only the first three joined users
                        .map((g, index) => (
                          <View
                            key={index}
                            style={{
                              position: "relative",
                              marginLeft: index > 0 ? -10 : 0,
                            }}
                          >
                            <Image
                              style={styles.joinedUserImg}
                              source={{
                                uri: g.profiles?.avatar_url
                                  ? g.profiles?.avatar_url
                                  : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
                              }}
                            />
                          </View>
                        ))}
                      <View>
                        {groups?.length > 3 &&
                          groups.filter((g) => g.group_id === item.group_id)
                            ?.length > 3 && (
                            <Text
                              style={
                                theme == "dark"
                                  ? {
                                      marginLeft: 5,
                                      fontFamily: "Inter-Regular",
                                      color: "grey",
                                    }
                                  : {
                                      marginLeft: 5,
                                      fontFamily: "Inter-Regular",
                                      color: "#2f2d51",
                                    }
                              }
                            >
                              +
                              {groups.filter(
                                (g) => g.group_id === item.group_id,
                              )?.length - 3}
                            </Text>
                          )}
                      </View>
                    </View>
                  </View>
                </View>
                <AntDesign
                  name="right"
                  size={24}
                  color={theme == "dark" ? "white" : "#2f2d51"}
                />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </Container>
  );
};

export default PublicGroupsScreen;

const styles = StyleSheet.create({
  joinedUserImg: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
});
