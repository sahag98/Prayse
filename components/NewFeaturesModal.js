import React, { useRef, useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import Animated, { FadeIn } from "react-native-reanimated";

import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from "@expo/vector-icons";

import googleIcon from "../assets/google-icon.png";
import { ModalContainer } from "../styles/appStyles";
const NewFeaturesModal = ({ theme, setFeatureVisible, featureVisible }) => {
  const [page, setPage] = useState(0);

  const ref = useRef();

  const onNextPage = () => {
    if (page < 3) {
      setPage(page + 1);
    }
  };

  async function StartOver() {
    setFeatureVisible(false);
    setPage(0);
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={featureVisible}
      onRequestClose={() => setFeatureVisible(false)}
      statusBarTranslucent
    >
      <ModalContainer
        style={
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          style={
            theme === "dark"
              ? {
                  borderRadius: 5,
                  position: "relative",
                  padding: 15,
                  width: "90%",
                  justifyContent: "space-between",
                  backgroundColor: "#212121",
                }
              : {
                  borderRadius: 5,
                  position: "relative",
                  padding: 15,
                  width: "90%",
                  justifyContent: "space-between",
                  backgroundColor: "#b7d3ff",
                }
          }
        >
          <Text
            style={
              theme === "dark"
                ? {
                    textAlign: "center",
                    fontFamily: "Inter-Black",
                    color: "white",
                    fontSize: 25,
                    letterSpacing: 1,
                    marginBottom: 10,
                  }
                : {
                    textAlign: "center",
                    fontFamily: "Inter-Black",
                    color: "#2f2d51",
                    fontSize: 25,
                    marginBottom: 10,
                  }
            }
          >
            What's new!
          </Text>
          <View ref={ref}>
            {page === 0 && (
              <View style={{ alignItems: "center", gap: 10 }}>
                <MaterialCommunityIcons
                  name="hands-pray"
                  size={100}
                  color={theme == "dark" ? "white" : "#2f2d51"}
                />

                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontFamily: "Inter-Bold",
                          fontSize: 22,
                          color: "white",
                        }
                      : {
                          fontFamily: "Inter-Bold",
                          fontSize: 22,
                          color: "#2f2d51",
                        }
                  }
                >
                  Streaks
                </Text>
                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontFamily: "Inter-Regular",
                          fontSize: 15,
                          color: "#dbdbdb",
                        }
                      : {
                          fontFamily: "Inter-Regular",
                          fontSize: 15,
                          color: "#2f2d51",
                        }
                  }
                >
                  Go through the daily devotions every day to receive a free
                  Prayse merch item!
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={
                      theme === "dark"
                        ? {
                            width: "45%",
                            borderColor: "#A5C9FF",
                            borderWidth: 1,
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        : {
                            width: "45%",
                            backgroundColor: "#caecfc",
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                    onPress={StartOver}
                  >
                    <Text
                      style={
                        theme === "dark"
                          ? { color: "white", fontFamily: "Inter-Bold" }
                          : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                      }
                    >
                      Exit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      theme === "dark"
                        ? {
                            width: "45%",
                            backgroundColor: "#A5C9FF",
                            borderWidth: 1,
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        : {
                            width: "45%",
                            backgroundColor: "#2f2d51",
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                    onPress={onNextPage}
                  >
                    <Text
                      style={
                        theme === "dark"
                          ? { color: "#212121", fontFamily: "Inter-Bold" }
                          : { color: "white", fontFamily: "Inter-Bold" }
                      }
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {page === 1 && (
              <View style={{ alignItems: "center", gap: 10 }}>
                <Feather
                  name="layout"
                  size={100}
                  color={theme === "dark" ? "white" : "#2f2d51"}
                />

                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontFamily: "Inter-Bold",
                          fontSize: 22,
                          color: "white",
                        }
                      : {
                          fontFamily: "Inter-Bold",
                          fontSize: 22,
                          color: "#2f2d51",
                        }
                  }
                >
                  Improved UI
                </Text>
                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontFamily: "Inter-Regular",
                          fontSize: 15,
                          color: "#dbdbdb",
                        }
                      : {
                          fontFamily: "Inter-Regular",
                          fontSize: 15,
                          color: "#2f2d51",
                        }
                  }
                >
                  Updated layout of Home and Prayer screen for better
                  readability and usability.
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={
                      theme === "dark"
                        ? {
                            width: "45%",
                            borderColor: "#A5C9FF",
                            borderWidth: 1,
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        : {
                            width: "45%",
                            backgroundColor: "#caecfc",
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                    onPress={StartOver}
                  >
                    <Text
                      style={
                        theme === "dark"
                          ? { color: "white", fontFamily: "Inter-Bold" }
                          : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                      }
                    >
                      Exit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      theme === "dark"
                        ? {
                            width: "45%",
                            backgroundColor: "#A5C9FF",
                            borderWidth: 1,
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        : {
                            width: "45%",
                            backgroundColor: "#2f2d51",
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                    onPress={onNextPage}
                  >
                    <Text
                      style={
                        theme === "dark"
                          ? { color: "#212121", fontFamily: "Inter-Bold" }
                          : { color: "white", fontFamily: "Inter-Bold" }
                      }
                    >
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {page === 2 && (
              <View style={{ alignItems: "center", gap: 10 }}>
                <Image style={styles.img} source={googleIcon} />

                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontFamily: "Inter-Bold",
                          fontSize: 22,
                          color: "white",
                        }
                      : {
                          fontFamily: "Inter-Bold",
                          fontSize: 22,
                          color: "#2f2d51",
                        }
                  }
                >
                  Google Sign In
                </Text>
                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontFamily: "Inter-Regular",
                          fontSize: 15,
                          color: "#dbdbdb",
                        }
                      : {
                          fontFamily: "Inter-Regular",
                          fontSize: 15,
                          color: "#2f2d51",
                        }
                  }
                >
                  Ability to sign in to community using your google account.
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={
                      theme === "dark"
                        ? {
                            width: "45%",
                            borderColor: "#A5C9FF",
                            borderWidth: 1,
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        : {
                            width: "45%",
                            backgroundColor: "#caecfc",
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                    onPress={StartOver}
                  >
                    <Text
                      style={
                        theme === "dark"
                          ? { color: "white", fontFamily: "Inter-Bold" }
                          : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                      }
                    >
                      Exit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      theme === "dark"
                        ? {
                            width: "45%",
                            backgroundColor: "#A5C9FF",
                            borderWidth: 1,
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        : {
                            width: "45%",
                            backgroundColor: "#2f2d51",
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                    onPress={StartOver}
                  >
                    <Text
                      style={
                        theme === "dark"
                          ? { color: "#212121", fontFamily: "Inter-Bold" }
                          : { color: "white", fontFamily: "Inter-Bold" }
                      }
                    >
                      Got it
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* {page === 3 && (
              <View style={{ alignItems: "center", gap: 10 }}>
                <MaterialIcons
                  name="published-with-changes"
                  size={100}
                  color="white"
                />
                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontFamily: "Inter-Bold",
                          fontSize: 22,
                          color: "white",
                        }
                      : {
                          fontFamily: "Inter-Bold",
                          fontSize: 22,
                          color: "#2f2d51",
                        }
                  }
                >
                  Changes/Fixes:
                </Text>
                <View style={{ gap: 5 }}>
                  <Text
                    style={
                      theme === "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Fixed notification bug.
                  </Text>
                  <Text
                    style={
                      theme === "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - New Public Groups section.
                  </Text>
                  <Text
                    style={
                      theme === "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Overall design changes.
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    marginTop: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={
                      theme === "dark"
                        ? {
                            width: "100%",
                            backgroundColor: "#A5C9FF",
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        : {
                            width: "100%",
                            backgroundColor: "#2f2d51",
                            padding: 15,
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                    onPress={StartOver}
                  >
                    <Text
                      style={
                        theme === "dark"
                          ? { color: "#121212", fontFamily: "Inter-Bold" }
                          : { color: "white", fontFamily: "Inter-Bold" }
                      }
                    >
                      Got It
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {page === 4 && (
              <View style={{ alignItems: "center", gap: 10 }}>
                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontFamily: "Inter-Medium",
                          fontSize: 18,
                          color: "white",
                        }
                      : {
                          fontFamily: "Inter-Medium",
                          fontSize: 18,
                          color: "#2f2d51",
                        }
                  }
                >
                  Small Changes:
                </Text>
                <View style={{ alignItems: "center", gap: 10 }}>
                  <Text
                    style={
                      theme === "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Verse of the Day design changes.
                  </Text>

                  <Text
                    style={
                      theme === "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Fixed Community swear word error.
                  </Text>
                  <Text
                    style={
                      theme === "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Changed Settings page design.
                  </Text>
                  <Text
                    style={
                      theme === "dark"
                        ? {
                            fontFamily: "Inter-Regular",
                            marginBottom: 10,
                            color: "#dbdbdb",
                          }
                        : {
                            fontFamily: "Inter-Regular",
                            marginBottom: 10,
                            color: "#2f2d51",
                          }
                    }
                  >
                    - Removed update suggestion for now.
                  </Text>
                </View>
                <TouchableOpacity
                  style={
                    theme == "dark"
                      ? {
                          width: "100%",
                          backgroundColor: "#A5C9FF",
                          padding: 15,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }
                      : {
                          width: "100%",
                          backgroundColor: "#2f2d51",
                          padding: 15,
                          borderRadius: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }
                  }
                  onPress={StartOver}
                >
                  <Text
                    style={
                      theme === "dark"
                        ? { color: "#121212", fontFamily: "Inter-Bold" }
                        : { color: "white", fontFamily: "Inter-Bold" }
                    }
                  >
                    Got it!
                  </Text>
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        </Animated.View>
      </ModalContainer>
    </Modal>
  );
};

export default NewFeaturesModal;

const styles = StyleSheet.create({
  img: {
    width: 80,
    height: 80,
  },
});
