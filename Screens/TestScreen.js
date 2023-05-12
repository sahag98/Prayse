import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, TouchableOpacity } from 'react-native';

const TestScreen = () => {
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const slideUpValue = useRef(new Animated.Value(0)).current;

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

  const handleButtonClick = () => {
    setIsBoxVisible(true);
    Animated.timing(slideUpValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleButtonClick}>
        <Text style={styles.buttonText}>Show Box</Text>
      </TouchableOpacity>
      {isBoxVisible && (
        <Animated.View
          style={[
            styles.box,
            {
              transform: [{ translateY: slideUpValue }],
              opacity: slideUpValue.interpolate({
                inputRange: [-500, 0, 500],
                outputRange: [0, 1, 0],
              }),
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.text}>This is the box that slides up!</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 5,
    margin: 20,
  },
  box: {
    width: '100%',
    height: '50%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default TestScreen;
