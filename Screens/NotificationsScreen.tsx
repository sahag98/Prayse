import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, Ionicons } from "@expo/vector-icons";

import NotiItem from "../components/NotiItem";
import { deleteAll } from "../redux/notiReducer";
import { Container } from "../styles/appStyles";

const Notifications = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const notis = useSelector((state: any) => state.noti.notifications);
  const theme = useSelector((state: any) => state.user.theme);

  // const notiArray = [
  //   {
  //     noti_id: 0,
  //     date: "today",
  //     notification: "testing notification layout 0",
  //     screen: "Home",
  //     prayerId: 0,
  //     identifier: 123,
  //   },
  // ];

  return (
    <Container
      style={
        theme == "dark"
          ? {
              backgroundColor: "#121212",
            }
          : {
              backgroundColor: "#f2f7ff",
            }
      }
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <Ionicons
              name="chevron-back"
              size={35}
              color={theme == "light" ? "#2f2d51" : "white"}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 20,
              color: theme == "dark" ? "white" : "#2f2d51",
            }}
          >
            Notifications
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            dispatch(deleteAll());
            // navigation.navigate("Home");
          }}
          style={{ padding: 10, alignSelf: "flex-end" }}
        >
          <Text
            style={
              theme == "dark"
                ? { fontFamily: "Inter-Bold", fontSize: 17, color: "#e24774" }
                : { fontFamily: "Inter-Bold", fontSize: 17, color: "#ff6262" }
            }
          >
            Clear All
          </Text>
        </TouchableOpacity>
      </View>
      {notis.length == 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          }}
        >
          <AntDesign
            name="notification"
            size={50}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
          <Text style={{ color: theme == "dark" ? "white" : "#2f2d51" }}>
            No notifications at the moment.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notis}
          keyExtractor={(item) => item.noti_id}
          onEndReachedThreshold={0}
          initialNumToRender={8}
          windowSize={8}
          // ListHeaderComponent={() => (
          //   <TouchableOpacity
          //     onPress={() => {
          //       dispatch(deleteAll());
          //       navigation.navigate("Home");
          //     }}
          //     style={{ padding: 10, alignSelf: "flex-end" }}
          //   >
          //     <Text
          //       style={
          //         theme == "dark"
          //           ? { fontFamily: "Inter-Bold", color: "#e24774" }
          //           : { fontFamily: "Inter-Bold", color: "#ff6262" }
          //       }
          //     >
          //       Clear all
          //     </Text>
          //   </TouchableOpacity>
          // )}
          // ItemSeparatorComponent={() => (
          //   <Divider
          //     style={
          //       theme == "dark"
          //         ? { backgroundColor: "#525252" }
          //         : { backgroundColor: "#2f2d51" }
          //     }
          //   />
          // )}
          contentContainerStyle={{ paddingTop: 10 }}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NotiItem theme={theme} navigation={navigation} item={item} />
          )}
        />
      )}
    </Container>
  );
};

export default Notifications;

// const styles = StyleSheet.create({});
