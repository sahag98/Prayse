import React from "react";
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

import merch from "../assets/merch.png";
<AntDesign name="rightcircleo" size={24} color="black" />;
const MerchComponent = ({ theme }) => {
  return (
    <View
      style={
        theme === "dark" ? styles.merchContainerDark : styles.merchContainer
      }
    >
      <View
        style={{
          width: "100%",
          flexDirection: Platform.isPad ? "row" : "column",

          justifyContent: "between",
          alignItems: "center",
          gap: Platform.isPad ? 30 : 10,
          flex: 1,
        }}
      >
        <View
          style={{
            width: Platform.isPad ? "auto" : "100%",
            // width: "50%",
            // height: "100%",
            gap: 5,
            // justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: theme === "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Bold",
              fontSize: 18,
            }}
          >
            Prayse Merch
          </Text>
          <Text
            style={{
              color: theme === "dark" ? "#bebebe" : "#2f2d51",
              fontFamily: "Inter-Regular",
              marginBottom: 10,
            }}
          >
            Reminding us of the power of prayer and praise in our walk with God.
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://shop.prayse.app/")}
            style={{
              backgroundColor: theme === "dark" ? "#a5c9ff" : "#2f2d51",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              width: Platform.isPad ? "50%" : "100%",
              padding: 12,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: theme === "dark" ? "#121212" : "white",
                fontFamily: "Inter-Bold",
                fontSize: 15,
              }}
            >
              Shop Now
            </Text>
            <AntDesign
              name="shoppingcart"
              size={22}
              color={theme === "dark" ? "#121212" : "white"}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={merch}
          style={[
            styles.merchImg,
            {
              flex: 1,
              width: "100%",
              height: 350,
              aspectRatio: Platform.isPad ? 1 / 1 : null,
            },
          ]}
        />
      </View>
    </View>
  );
};

export default MerchComponent;

const styles = StyleSheet.create({
  merchContainer: {
    flex: 1,
    backgroundColor: "#b7d3ff",
    padding: 10,
    width: "100%",
    shadowColor: "#9f9f9f",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
    borderRadius: 10,
    marginBottom: 15,
  },
  merchContainerDark: {
    flex: 1,
    backgroundColor: "#212121",
    borderWidth: 1,
    borderColor: "#474747",
    padding: 10,
    width: "100%",
    borderRadius: 10,
    marginBottom: 15,
  },
  merchImg: { flex: 1 },
});
