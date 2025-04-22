import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, GestureResponderEvent } from 'react-native';

type Props = {
    aqi: number;
    color: string;
    location: string;
    coords: {latitude: number, longitude: number};
    date: Date;
    setSelectedDate: (date: Date) => void;
    setCoords: (coords: {latitude: number, longitude: number}) => void;
};

function formatDate(date: Date) { 
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const yyyy = date.getFullYear();

    const formatted = `${dd}/${mm}/${yyyy}`;
    return formatted;
}
  
const AQIBoxButton = ({ aqi, color, location, date,  coords, setCoords, setSelectedDate }: Props) => {
    const onPress = () => {
        setCoords(coords);
        setSelectedDate(new Date());
        console.log(`AQI: ${aqi}, Location: ${location}, Time: ${date}`);
    }

    return (
    <TouchableOpacity style={[styles.box, {backgroundColor: color}]} onPress={onPress}>
      <Text style={styles.aqi}>AQI: {aqi}</Text>
      <View style={styles.infoRow}>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.separator}> • </Text>
          <Text style={styles.time}>{formatDate(date)}</Text>
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
