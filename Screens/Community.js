import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import {
  Container,
  HeaderView,
  HeaderTitle,
  StyledInput,
} from "../styles/appStyles";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { firebase } from "../firebase";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import NetInfo from "@react-native-community/netinfo";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";

const Community = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const size = useSelector((state) => state.user.fontSize);
  const [todos, setTodos] = useState([]);
  const todoRef = firebase.firestore().collection("todos");
  const [addData, setAddData] = useState("");
  const [error, setError] = useState(false);
  const [swearError, setSwearError] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    checkConnection();
    todoRef
      .orderBy("createdAt", "desc", "likes")
      .onSnapshot((querySnapshot) => {
        const todos = [];
        querySnapshot.forEach((doc) => {
          const { heading } = doc.data();
          const { likes } = doc.data();
          const { complete } = doc.data();
          try {
            const sec = doc.data().createdAt.seconds;
            const time = new Date(sec * 1000).toLocaleString();
            todos.push({
              id: doc.id,
              heading,
              date: time,
              likes: likes,
              complete: complete,
            });
          } catch (error) {
            console.log(error);
          }
        });
        setTodos(todos);
      });
  }, []);

  const updateTodo = (id) => {
    todoRef.doc(id).update({
      likes: firebase.firestore.FieldValue.increment(1),
    });
  };

  const complete = (id) => {
    todoRef.doc(id).update({
      complete: true,
    });
  };

  const [loading, setLoading] = useState(false);

  setTimeout(() => {
    setLoading(true);
  }, 1500);

  const addTodo = () => {
    if (addData == "Text" || addData == "text") {
      console.log("here");
      return;
    }
    if (addData && addData.length > 0 && addData != "Text") {
      const message = {
        title: "Community",
        message: "New community prayer! Check it out",
        data: { screen: "Community", verseTitle: "" },
      };

      fetch("https://prayse.herokuapp.com/message", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      setError(false);
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: addData,
        createdAt: timestamp,
        likes: 0,
        complete: false,
      };
      todoRef
        .add(data)
        .then(() => {
          setAddData("");
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      setError(!error);
      setSwearError(false);
    }
  };

  const checkConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected == true) {
        setIsConnected(true);
      } else setIsConnected(false);
    });
  };

  let [fontsLoaded] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return isConnected ? (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      {loading == false && (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <LottieView
            source={require("../assets/97930-loading.json")}
            style={styles.animation}
            autoPlay
          />
        </View>
      )}
      {loading == true && (
        <View style={{ position: "relative", height: "100%" }}>
          <HeaderView>
            <HeaderTitle
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", color: "white" }
                  : { fontFamily: "Inter-Bold", color: "#2F2D51" }
              }
            >
              Community NEW
            </HeaderTitle>
          </HeaderView>
          <Text
            style={
              theme == "dark"
                ? {
                    fontFamily: "Inter-Light",
                    color: "white",
                    textAlign: "center",
                    fontSize: 15,
                  }
                : {
                    fontFamily: "Inter-Light",
                    color: "#2F2D51",
                    textAlign: "center",
                    fontSize: 15,
                  }
            }
          >
            A place to share prayers and pray for one another.
          </Text>

          <Text
            style={
              theme == "dark"
                ? {
                    fontFamily: "Inter-Regular",
                    color: "white",
                    textAlign: "left",
                    fontSize: 15,
                    paddingBottom: 5,
                  }
                : {
                    fontFamily: "Inter-Regular",
                    color: "#2F2D51",
                    textAlign: "left",
                    fontSize: 15,
                    paddingBottom: 5,
                  }
            }
          >
            If your prayer gets answered let us know by clicking on the check
            mark that's on your prayer!
          </Text>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              paddingBottom: 10,
            }}
          >
            <StyledInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              onChangeText={(heading) => setAddData(heading)}
              value={addData}
              placeholder="Add a prayer"
              placeholderTextColor={"white"}
              selectionColor={"white"}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              multiline={true}
            />
            <TouchableOpacity
              style={theme == "dark" ? styles.AddButtonDark : styles.AddButton}
              onPress={addTodo}
            >
              <AntDesign
                name="plus"
                size={35}
                color={theme == "dark" ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
          {error == true && (
            <Text
              style={{
                fontFamily: "Inter-Light",
                fontSize: 13.5,
                color: "#FE5050",
                paddingBottom: 10,
              }}
            >
              Type in a prayer and try again.
            </Text>
          )}
          {swearError == true && (
            <Text
              style={{
                fontFamily: "Inter-Light",
                fontSize: 13.5,
                color: "#FE5050",
                paddingBottom: 10,
              }}
            >
              Can't have any swear words in a prayer. Try again.
            </Text>
          )}

          <FlashList
            data={todos}
            estimatedItemSize={200}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={theme == "dark" ? styles.listDark : styles.list}>
                <Text
                  style={
                    theme == "dark"
                      ? {
                          fontSize: size,
                          fontFamily: "Inter-Regular",
                          color: "white",
                          paddingBottom: 5,
                        }
                      : {
                          fontSize: size,
                          fontFamily: "Inter-Regular",
                          color: "#2f2d51",
                          paddingBottom: 5,
                        }
                  }
                >
                  {item.heading[0].toUpperCase() + item.heading.slice(1)}
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={theme == "dark" ? styles.dateDark : styles.date}>
                    {item.date}
                  </Text>
                  <View style={{ alignItems: "center", flexDirection: "row" }}>
                    <TouchableOpacity
                      style={{ flexDirection: "row", alignItems: "center" }}
                      onPress={() => updateTodo(item.id)}
                    >
                      <MaterialCommunityIcons
                        name="hands-pray"
                        size={24}
                        color={theme == "dark" ? "#FE5050" : "#AD1616"}
                      />
                      <Text
                        style={
                          theme == "dark"
                            ? { paddingLeft: 3, color: "#FE5050" }
                            : { paddingLeft: 3, color: "#AD1616" }
                        }
                      >
                        {item.likes}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {item.complete == false && (
                        <AntDesign
                          style={{ paddingLeft: 20 }}
                          onPress={() => complete(item.id)}
                          name="check"
                          size={24}
                          color={theme == "dark" ? "#9C9C9C" : "#4e4a8a"}
                        />
                      )}
                      {item.complete == true && (
                        <AntDesign
                          style={{ paddingLeft: 20 }}
                          name="check"
                          size={24}
                          color={theme == "dark" ? "green" : "#14641B"}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </Container>
  ) : (
    <Container
      style={
        theme == "dark"
          ? {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#121212",
            }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <TouchableOpacity onPress={checkConnection}>
        <Text style={theme == "dark" ? { color: "white" } : { color: "black" }}>
          No network connection. Please try again.
        </Text>
      </TouchableOpacity>
    </Container>
  );
};

export default Community;

const styles = StyleSheet.create({
  itemHeading: {
    fontSize: 18,
    fontFamily: "Inter-Regular",
    color: "#2F2D51",
    paddingBottom: 5,
  },
  fabStyle: {
    position: "absolute",
    bottom: 13,
    right: "5%",
    zIndex: 99,
    backgroundColor: "#2F2D51",
  },
  fabStyleDark: {
    position: "absolute",
    bottom: 13,
    right: "1%",
    zIndex: 99,
    backgroundColor: "white",
  },
  itemHeadingDark: {
    fontFamily: "Inter-Regular",
    color: "white",
    paddingBottom: 5,
  },
  input: {
    width: "80%",
    height: 55,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#2F2D51",
    fontSize: 14,
    letterSpacing: 1,
    alignItems: "center",
  },
  inputDark: {
    width: "80%",
    height: 55,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#212121",
    fontSize: 14,
    letterSpacing: 1,
    alignItems: "center",
  },
  animation: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  AddButton: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: "#2F2D51",
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  AddButtonDark: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: "white",
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  list: {
    backgroundColor: "#93D8F8",
    minHeight: 60,
    width: "100%",
    padding: 15,
    justifyContent: "space-around",
    marginBottom: 20,
    borderRadius: 10,
  },
  listDark: {
    backgroundColor: "#212121",
    minHeight: 60,
    width: "100%",
    padding: 15,
    justifyContent: "space-around",
    marginBottom: 20,
    borderRadius: 10,
  },
  date: {
    fontSize: 11,
    letterSpacing: 1,
    color: "#4e4a8a",
    fontFamily: "Inter-Regular",
    textTransform: "uppercase",
    paddingTop: 8,
    textAlign: "right",
  },
  dateDark: {
    fontSize: 11,
    letterSpacing: 1,
    color: "#8C8C8C",
    fontFamily: "Inter-Regular",
    textTransform: "uppercase",
    paddingTop: 8,
    textAlign: "right",
  },
});
