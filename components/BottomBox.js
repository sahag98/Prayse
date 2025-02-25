import React, { useRef } from "react";
import {
  Alert,
  Animated,
  PanResponder,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import uuid from "react-native-uuid";
import { useDispatch } from "react-redux";

import { AntDesign, Feather } from "@expo/vector-icons";

import { addToAnsweredPrayer } from "../redux/answeredReducer";
import { deletePrayer } from "../redux/prayerReducer";

const BottomBox = ({
  slideUpValue,
  setIsEditing,
  setLoading,
  handleTriggerEdit,
  answeredAlready,
  opacity,
  theme,
  selectedEdit,
  setSelectedEdit,
  setIsBoxVisible,
}) => {
  const dispatch = useDispatch();

  function time() {
    setTimeout(() => {
      setLoading(false);
    }, 1100);
  }

  const handleAddToAnsweredPrayer = (prayer) => {
    setIsEditing(false);
    dispatch(
      addToAnsweredPrayer({
        answeredDate: new Date().toDateString(),
        prayer,
        id: uuid.v4(),
      })
    );
    setLoading(true);
    setIsBoxVisible(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500, // in milliseconds
      useNativeDriver: true,
    }).start();
    time();
    setSelectedEdit("");
  };

  const handleDelete = (prayer) => {
    dispatch(deletePrayer(prayer));
    setSelectedEdit("");
    setIsBoxVisible(false);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500, // in milliseconds
      useNativeDriver: true,
    }).start();
  };

  const onShare = async (title) => {
    try {
      await Share.share({
        message: title,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 0,
      onPanResponderMove: (_, { dy }) => {
        slideUpValue.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 100 || vy > 0.5) {
          Animated.timing(slideUpValue, {
            toValue: 500,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setIsBoxVisible(false));
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500, // in milliseconds
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(slideUpValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={
          theme === "dark"
            ? [
                styles.boxDark,
                {
                  transform: [{ translateY: slideUpValue }],
                  opacity: slideUpValue.interpolate({
                    inputRange: [-500, 0, 500],
                    outputRange: [0, 1, 0],
                  }),
                },
              ]
            : [
                styles.box,
                {
                  transform: [{ translateY: slideUpValue }],
                  opacity: slideUpValue.interpolate({
                    inputRange: [-500, 0, 500],
                    outputRange: [0, 1, 0],
                  }),
                },
              ]
        }
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={{
            alignSelf: "center",
            backgroundColor: "grey",
            width: 60,
            height: 5,
            borderRadius: 50,
            marginBottom: 10,
          }}
        />
        {answeredAlready === selectedEdit.id ? (
          <TouchableOpacity
            disabled
            underlayColor="#212121"
            style={styles.buttonItems}
          >
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "#66b266",
                      fontSize: 15,
                      fontFamily: "Inter-Medium",
                    }
                  : {
                      color: "#89ff89",
                      fontSize: 15,
                      fontFamily: "Inter-Medium",
                    }
              }
            >
              Already marked
            </Text>
            <Feather name="check-circle" size={22} color="#66b266" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.buttonItems}
            onPress={() => handleAddToAnsweredPrayer(selectedEdit)}
          >
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "#66b266",
                      fontSize: 15,
                      fontFamily: "Inter-Medium",
                    }
                  : {
                      color: "#00c400",
                      fontSize: 15,
                      fontFamily: "Inter-Medium",
                    }
              }
            >
              Mark as answered
            </Text>
            <Feather name="check-circle" size={22} color="#aaaaaa" />
          </TouchableOpacity>
        )}
        <Divider style={{ marginVertical: 5, backgroundColor: "grey" }} />
        <TouchableOpacity
          onPress={() => onShare(selectedEdit.prayer)}
          style={styles.buttonItems}
        >
          <Text
            style={{ color: "white", fontSize: 15, fontFamily: "Inter-Medium" }}
          >
            Share prayer
          </Text>
          <AntDesign name="sharealt" size={20} color="#ebebeb" />
        </TouchableOpacity>
        <Divider style={{ marginVertical: 5, backgroundColor: "grey" }} />
        <TouchableOpacity
          onPress={() => handleTriggerEdit(selectedEdit)}
          style={styles.buttonItems}
        >
          <Text
            style={
              theme === "dark"
                ? { color: "#A5C9FF", fontSize: 15, fontFamily: "Inter-Medium" }
                : { color: "#6B7EFF", fontSize: 15, fontFamily: "Inter-Medium" }
            }
          >
            Edit prayer
          </Text>
          <Feather
            name="edit"
            size={22}
            color={theme === "dark" ? "#A5C9FF" : "#6B7EFF"}
          />
        </TouchableOpacity>
        <Divider style={{ marginVertical: 5, backgroundColor: "grey" }} />
        <TouchableOpacity
          style={styles.buttonItems}
          onPress={() => handleDelete(selectedEdit.id)}
        >
          <Text
            style={
              theme === "dark"
                ? { color: "#ff6666", fontSize: 15, fontFamily: "Inter-Medium" }
                : { color: "#ff6262", fontSize: 15, fontFamily: "Inter-Medium" }
            }
          >
            Delete prayer
          </Text>
          <AntDesign
            name="close"
            size={23}
            color={theme === "dark" ? "#ff6666" : "#ff6262"}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 99,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonItems: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 5,
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    backgroundColor: "blue",
    color: "white",
    borderRadius: 5,
    margin: 20,
  },
  boxDark: {
    width: "100%",
    backgroundColor: "#3b3b3b",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  box: {
    width: "100%",
    backgroundColor: "#b7d3ff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

export default BottomBox;
