import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';


const GreetingAnimation = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Set the duration of the fade-in effect
      useNativeDriver: true,
    });

    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500, // Set the duration of the fade-out effect
      useNativeDriver: true,
    });

    const animationSequence = Animated.sequence([fadeIn, fadeOut]);

    const flashingAnimation = () => {
      Animated.loop(animationSequence).start();
    };

    const showAndStayAnimation = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Set the duration of the fade-in effect before staying visible
        useNativeDriver: true,
      })
    };

    showAndStayAnimation();

    return () => {
      fadeAnim.stopAnimation();
    };
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text>Good Morning</Text>
    </Animated.View>
  );
};


export default GreetingAnimation