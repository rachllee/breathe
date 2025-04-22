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
            <AQIBoxButton aqi={20} color="#A8E6CF" location="Austin" time="9/11/12" />
            <AQIBoxButton aqi={33} color="#FFD3B6" location="Los Angeles" time="2/12/23" />
            <AQIBoxButton aqi={57} color="#FF6B6B" location="Chicago" time="7/20/22" />
            <AQIBoxButton aqi={90} color="#8B0000" location="New York" time="1/24/25" />
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
