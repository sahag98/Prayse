import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Modal } from "react-native";
import { ModalContainer } from "../styles/appStyles";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

import { useRef } from "react";

import googleIcon from "../assets/google-icon.png";
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
      transparent={true}
      visible={featureVisible}
      onRequestClose={() => setFeatureVisible(false)}
      statusBarTranslucent={true}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <Animated.View
          entering={FadeIn.duration(500)}
          style={
            theme == "dark"
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
              theme == "dark"
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
                    theme == "dark"
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
                  Prayer Room
                </Text>
                <Text
                  style={
                    theme == "dark"
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
                  Be able to go through all your prayers, and pray for each one!
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
                      theme == "dark"
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
                        theme == "dark"
                          ? { color: "white", fontFamily: "Inter-Bold" }
                          : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                      }
                    >
                      Exit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      theme == "dark"
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
                        theme == "dark"
                          ? { color: "#212121", fontFamily: "Inter-Bold" }
                          : { color: "white", fontFamily: "Inter-Bold" }
                      }
                    >
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {page === 1 && (
              <View style={{ alignItems: "center", gap: 10 }}>
                <MaterialCommunityIcons
                  name="cross"
                  size={100}
                  color={theme == "BlackWhite" ? "black" : "#8cbaff"}
                />

                <Text
                  style={
                    theme == "dark"
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
                  Gospel of Jesus
                </Text>
                <Text
                  style={
                    theme == "dark"
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
                  How can someone receive Jesus and get saved?
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
                      theme == "dark"
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
                        theme == "dark"
                          ? { color: "white", fontFamily: "Inter-Bold" }
                          : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                      }
                    >
                      Exit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      theme == "dark"
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
                        theme == "dark"
                          ? { color: "#212121", fontFamily: "Inter-Bold" }
                          : { color: "white", fontFamily: "Inter-Bold" }
                      }
                    >
                      Continue
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
                    theme == "dark"
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
                    theme == "dark"
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
                      theme == "dark"
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
                        theme == "dark"
                          ? { color: "white", fontFamily: "Inter-Bold" }
                          : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                      }
                    >
                      Exit
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      theme == "dark"
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
                        theme == "dark"
                          ? { color: "#212121", fontFamily: "Inter-Bold" }
                          : { color: "white", fontFamily: "Inter-Bold" }
                      }
                    >
                      Continue
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {page === 3 && (
              <View style={{ alignItems: "center", gap: 10 }}>
                <MaterialIcons
                  name="published-with-changes"
                  size={100}
                  color="white"
                />
                <Text
                  style={
                    theme == "dark"
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
                      theme == "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Fixed notification bug.
                  </Text>
                  <Text
                    style={
                      theme == "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - New Public Groups section.
                  </Text>
                  <Text
                    style={
                      theme == "dark"
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
                        theme == "dark"
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
                    theme == "dark"
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
                      theme == "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Verse of the Day design changes.
                  </Text>

                  <Text
                    style={
                      theme == "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Fixed Community swear word error.
                  </Text>
                  <Text
                    style={
                      theme == "dark"
                        ? { fontFamily: "Inter-Regular", color: "#dbdbdb" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    - Changed Settings page design.
                  </Text>
                  <Text
                    style={
                      theme == "dark"
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

                  {/* <Text
                    style={
                      theme == "dark"
                        ? { fontFamily: "Inter-Regular", color: "white" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    Once you answer the question you will not be able to edit or
                    delete your question.
                  </Text> */}
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
                      theme == "dark"
                        ? { color: "#121212", fontFamily: "Inter-Bold" }
                        : { color: "white", fontFamily: "Inter-Bold" }
                    }
                  >
                    Got it!
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
