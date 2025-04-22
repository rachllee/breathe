import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AQIBoxButton from './AQIBoxButton';

const AQIPresetList: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // arrow down to up
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{padding: 10}} onPress={() => setIsVisible(prev => !prev)}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="chevron-up" size={24} color="#000" />
        </Animated.View>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.boxWrapper}>
          <AQIBoxButton aqi={90} location="Hanoi" time="2:45 PM" />
          <AQIBoxButton aqi={90} location="Hanoi" time="2:45 PM" />
          <AQIBoxButton aqi={90} location="Hanoi" time="2:45 PM" />
          <AQIBoxButton aqi={90} location="Hanoi" time="2:45 PM" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 30,
    right:10,
    alignItems: 'flex-end',
    borderRadius: 10,
    backgroundColor: 'white'
  },
  boxWrapper: {
    marginTop: 10,
  },
});

export default AQIPresetList;
