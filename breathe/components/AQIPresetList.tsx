import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AQIBoxButton from './AQIBoxButton';

type Props = {
    setCoords: (coords: {latitude :number, longitude: number}) => void;  
    setSelectedDate: (date: Date) => void;
}

const AQIPresetList = ({setCoords, setSelectedDate}: Props) => {
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
            <AQIBoxButton 
                setSelectedDate={setSelectedDate} setCoords={setCoords} 
                coords={{latitude: 21.0285, longitude: 105.8542}}
                aqi={20} color="#A8E6CF" location="Austin" date={new Date("2025-04-22T10:30:00Z")}/>
            <AQIBoxButton 
                setSelectedDate={setSelectedDate} setCoords={setCoords} 
                coords ={{latitude: 34.0212, longitude: -118.2589}}
                aqi={33} color="#FFD3B6" location="Los Angeles" date={new Date("2025-04-22T10:30:00Z")}/>
            <AQIBoxButton 
                setSelectedDate={setSelectedDate} setCoords={setCoords} 
                coords ={{latitude: 21.0285, longitude: 105.8542}}
                aqi={57} color="#FF6B6B" location="Chicago" date={new Date("2025-04-22T10:30:00Z")} />
            <AQIBoxButton 
                setSelectedDate={setSelectedDate} setCoords={setCoords} 
                coords ={{latitude: 21.0285, longitude: 105.8542}}
                aqi={90} color="#8B0000" location="New York" date={new Date("2025-04-22T10:30:00Z")}/>
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
