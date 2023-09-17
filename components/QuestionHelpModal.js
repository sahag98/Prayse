import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Modal } from "react-native";
import { ModalContainer } from "../styles/appStyles";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { Transition, Transitioning } from "react-native-reanimated";
import { Button } from "react-native";
import { useRef } from "react";
import { SvgUri } from "react-native-svg";

import questionLight from "../assets/questionLight.png";
import questionDark from "../assets/questionDark.png";
const QuestionHelpModal = ({
  questionHelpModal,
  setQuestionHelpModal,
  theme,
}) => {
  const [page, setPage] = useState(0);
  const transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={500} />
      <Transition.Out type="fade" durationMs={500} />
    </Transition.Together>
  );
  const ref = useRef();

  const onNextPage = () => {
    if (page < 1) {
      ref.current.animateNextTransition();
      setPage(page + 1);
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={questionHelpModal}
      onRequestClose={() => setQuestionHelpModal(false)}
      statusBarTranslucent={true}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <View
          style={
            theme == "dark"
              ? {
                  borderRadius: 5,
                  position: "relative",
                  padding: 15,
                  width: "100%",
                  backgroundColor: "#212121",
                }
              : {
                  borderRadius: 5,
                  position: "relative",
                  padding: 15,
                  width: "100%",
                  backgroundColor: "#93D8F8",
                }
          }
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter-Bold",
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Welcome to Question of the Week!
          </Text>
          <Transitioning.View ref={ref} transition={transition}>
            {page === 0 && (
              <View style={{ alignItems: "center", gap: 10 }}>
                <Image
                  style={styles.img}
                  source={theme == "dark" ? questionDark : questionLight}
                />

                <Text style={{ fontFamily: "Inter-Regular" }}>
                  This is a place where we can come together and explore
                  important questions related to our faith.
                </Text>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    width: "100%",
                    backgroundColor: "#2f2d51",
                    padding: 15,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={onNextPage}
                >
                  <Text style={{ color: "white", fontFamily: "Inter-Medium" }}>
                    Next
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {page === 1 && (
              <View>
                <Text>Page 2: This is the second page.</Text>
                <Button
                  title="Close"
                  onPress={() => setQuestionHelpModal(false)}
                />
              </View>
            )}
          </Transitioning.View>
        </View>
        {/* <View
          style={
            theme == "dark"
              ? {
                  borderRadius: 5,
                  position: "relative",
                  padding: 15,
                  width: "100%",
                  backgroundColor: "#212121",
                }
              : {
                  borderRadius: 5,
                  position: "relative",
                  padding: 15,
                  width: "100%",
                  backgroundColor: "#93D8F8",
                }
          }
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter-Bold",
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            Welcome to Question of the Week!
          </Text>
          <View style={{ gap: 5 }}>
            <Text style={{ fontFamily: "Inter-Regular" }}>
              This is a place where we can come together and explore important
              questions related to our faith.
            </Text>
            <Text style={{ fontFamily: "Inter-Regular" }}>
              A new question will be posted every week and we are looking
              forward to seeing your thoughtful answers.
            </Text>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 20,
              width: "100%",
              backgroundColor: "#2f2d51",
              padding: 15,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setQuestionHelpModal(false)}
          >
            <Text style={{ color: "white", fontFamily: "Inter-Medium" }}>
              Got it!
            </Text>
          </TouchableOpacity>
        </View> */}
      </ModalContainer>
    </Modal>
  );
};

export default QuestionHelpModal;

const styles = StyleSheet.create({
  img: {
    width: 150,
    height: 150,
  },
});
