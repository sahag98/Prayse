import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import merch from "../assets/merch.png";
import { AntDesign } from "@expo/vector-icons";
<AntDesign name="rightcircleo" size={24} color="black" />;
const MerchComponent = ({ theme }) => {
  return (
    <View
      style={
        theme == "dark" ? styles.merchContainerDark : styles.merchContainer
      }
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",

          flex: 1,
        }}
      >
        <View style={{ width: "50%", justifyContent: "space-between" }}>
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Bold",
              fontSize: 17,
            }}
          >
            Prayse Merch
          </Text>
          <Text
            style={{
              color: theme == "dark" ? "#bebebe" : "#2f2d51",
              fontFamily: "Inter-Regular",
            }}
          >
            Praise the Lord, we just launched our merch! Check them out.
            {/* <AntDesign name="rocket1" size={24} color="black" /> */}
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL("https://shop.prayse.app/")}
            style={{
              backgroundColor: theme == "dark" ? "#121212" : "#2f2d51",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
              width: "auto",
              padding: 12,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Bold" }}>
              Shop Now
            </Text>
            <AntDesign name="shoppingcart" size={22} color="white" />
          </TouchableOpacity>
        </View>
        <Image source={merch} style={styles.merchImg} />
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
  merchImg: {
    width: 150,
    objectFit: "contain",
    height: 150,
  },
});
