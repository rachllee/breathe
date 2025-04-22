import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, GestureResponderEvent } from 'react-native';

type Props = {
    aqi?: number;
    color: string;
    location?: string;
    time?: string;
    onPress?: (event: GestureResponderEvent) => void;
};
  
const AQIBoxButton = ({ aqi = 85, color, location = "Hanoi", time = "2:45 PM", onPress }: Props) => {
  return (
    <TouchableOpacity style={[styles.box, {backgroundColor: color}]} onPress={onPress}>
      <Text style={styles.aqi}>AQI: {aqi}</Text>
      <View style={styles.infoRow}>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.separator}> • </Text>
          <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    margin: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  separator: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  aqi: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default AQIBoxButton;
