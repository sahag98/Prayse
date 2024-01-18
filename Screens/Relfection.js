import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { Container, HeaderView } from "../styles/appStyles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import ReflectionItem from "../components/ReflectionItem";

const Relfection = ({ navigation, route }) => {
  const theme = useSelector((state) => state.user.theme);
  const [reflectionsArray, setReflectionsArray] = useState([]);
  const [reflection, setReflection] = useState("");
  const [inputHeight, setInputHeight] = useState(60);

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Container
        style={
          theme == "dark"
            ? { backgroundColor: "#121212" }
            : { backgroundColor: "#F2F7FF" }
        }
      >
        <HeaderView
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Devotional")}>
            <AntDesign
              name="left"
              size={30}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
        </HeaderView>
        <Text
          style={
            theme == "dark"
              ? {
                  color: "white",
                  fontSize: 16,
                  textTransform: "uppercase",
                  fontFamily: "Inter-Medium",
                }
              : {
                  color: "#2f2d51",
                  fontSize: 16,
                  textTransform: "uppercase",
                  fontFamily: "Inter-Medium",
                }
          }
        >
          {route?.params?.devoTitle}
        </Text>
        <Text
          style={
            theme == "dark"
              ? {
                  color: "white",
                  fontSize: 24,
                  marginTop: 10,
                  fontFamily: "Inter-Bold",
                }
              : {
                  color: "#2f2d51",
                  fontSize: 24,
                  marginTop: 10,
                  fontFamily: "Inter-Bold",
                }
          }
        >
          Reflections
        </Text>
        <View style={{ flex: 1, width: "100%" }}>
          {reflectionsArray.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5
                name="comments"
                size={80}
                color={theme == "dark" ? "#A5C9FF" : "#2f2d51"}
              />

              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        marginTop: 10,
                        fontSize: 18,
                        color: "#A5C9FF",
                      }
                    : {
                        fontFamily: "Inter-Bold",
                        marginTop: 10,
                        fontSize: 18,
                        color: "#2f2d51",
                      }
                }
              >
                No Reflections yet.
              </Text>
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Regular",
                        marginTop: 10,
                        color: "#A5C9FF",
                      }
                    : {
                        fontFamily: "Inter-Regular",
                        marginTop: 10,
                        color: "#2f2d51",
                      }
                }
              >
                Be the first one and leave a reflection.
              </Text>
            </View>
          ) : (
            <FlatList
              data={reflectionsArray}
              keyExtractor={(e, i) => i.toString()}
              onEndReachedThreshold={0}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <Divider
                  style={
                    theme == "dark"
                      ? { backgroundColor: "#525252", marginBottom: 10 }
                      : { backgroundColor: "#2f2d51", marginBottom: 10 }
                  }
                />
              )}
              renderItem={({ item }) => <ReflectionItem theme={theme} />}
            />
          )}
        </View>
      </Container>
      <View style={styles.inputField}>
        <TextInput
          style={theme == "dark" ? styles.inputDark : styles.input}
          placeholder="Add your reflection..."
          placeholderTextColor={theme == "dark" ? "#b8b8b8" : "#2f2d51"}
          selectionColor={theme == "dark" ? "white" : "#2f2d51"}
          value={reflection}
          onChangeText={(text) => setReflection(text)}
          onContentSizeChange={handleContentSizeChange}
          onSubmitEditing={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
          // multiline={true}
          // // ios fix for centering it at the top-left corner
          // numberOfLines={5}
        />
        <TouchableOpacity
          style={{
            backgroundColor: "#2f2d51",
            borderRadius: 100,
            padding: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {}}
        >
          <AntDesign name="arrowup" size={38} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Relfection;

const styles = StyleSheet.create({
  inputField: {
    borderTopColor: "#d2d2d2",
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "80%",

    borderRadius: 10,
    padding: 15,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "85%",

    borderRadius: 10,
    padding: 15,
  },
});
