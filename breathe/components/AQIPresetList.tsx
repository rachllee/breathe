import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text
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
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10, gap: 4 }} onPress={() => setIsVisible(prev => !prev)}>
        <View style={{ marginLeft: 10}}>
          <Text style={{ fontSize: 16, color: '#000' }}>Presets</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="chevron-up" size={24} color="#000" />
        </Animated.View>
      </TouchableOpacity>

      {isVisible && (
        <View style={styles.boxWrapper}>
            <AQIBoxButton 
                setSelectedDate={setSelectedDate} setCoords={setCoords} 
                coords={{latitude: 29.7516111969, longitude: -95.2716876815}}
                aqi={43} color="#A8E6CF" location="Houston" date={new Date("2025-02-19T10:30:00Z")}/>
            <AQIBoxButton 
                setSelectedDate={setSelectedDate} setCoords={setCoords} 
                coords ={{latitude: 34.0212, longitude: -118.2589}}
                aqi={73} color="#FFDA03" location="Los Angeles" date={new Date("2025-01-18T10:30:00Z")}/>
            <AQIBoxButton 
                setSelectedDate={setSelectedDate} setCoords={setCoords} 
                coords ={{latitude: 40.4522417345, longitude: -80.02305490804}}
                aqi={148} color="#FFA500" location="Pittsburgh" date={new Date("2023-07-17T10:30:00Z")} />
            <AQIBoxButton 
                setSelectedDate={setSelectedDate} setCoords={setCoords} 
                coords ={{latitude: 40.6867091041624, longitude: -73.998507536501}}
                aqi={228} color="#8B0000" location="New York" date={new Date("2023-06-07T10:30:00Z")}/>
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
