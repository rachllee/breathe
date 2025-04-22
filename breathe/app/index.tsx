import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert, Platform } from 'react-native';
import MapView, { Marker, MapPressEvent, Circle } from 'react-native-maps';
import AqiSlider from '@/components/AQISlider';
import DateTimePicker from '@react-native-community/datetimepicker';
import coverageSites from '../assets/coverage_sites.json';
import AQIBoxButton from '@/components/AQIBoxButton';
import AQIPresetList from '@/components/AQIPresetList';

type AQIReading = {
  DateObserved: string;
  HourObserved: number;
  LocalTimeZone: string;
  ReportingArea: string;
  StateCode: string;
  Latitude: number;
  Longitude: number;
  ParameterName: string;
  AQI: number;
  Category: {
    Number: number;
    Name: string;
  };
};

export default function App() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [aqiInfo, setAqiInfo] = useState<AQIReading | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  const isToday = (date: Date) => {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  };

  const fetchAQI = async (lat: number, lon: number) => {
    const API_KEY = '87202674-97D8-40A6-8AD2-B998075B6BFA';
    const dateStr = formatDate(selectedDate);

    const endpoint = isToday(selectedDate)
  ? `https://www.airnowapi.org/aq/observation/latLong/current?`
  : `https://www.airnowapi.org/aq/observation/latLong/historical?date=${dateStr}T00-0000&`;

const url = `${endpoint}format=application/json&latitude=${lat}&longitude=${lon}&distance=25&API_KEY=${API_KEY}`;


    try {
      const res = await fetch(url);
      const text = await res.text();

      try {
        const data: AQIReading[] = JSON.parse(text);

        if (!data || data.length === 0) {
          Alert.alert("No AQI data available for this location and date.");
          return null;
        }

        const highest = data.reduce((max, reading) =>
          reading.AQI > max.AQI ? reading : max, data[0]
        );

        setAqiInfo(highest);
        return highest.AQI;
      } catch (jsonErr) {
        console.error("JSON parse error:", jsonErr);
        console.log("Raw response:", text);
        Alert.alert("Failed to parse AQI data.");
        return null;
      }
    } catch (err) {
      console.error("AQI fetch error:", err);
      Alert.alert("Failed to fetch AQI data.");
      return null;
    }
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoords({ latitude, longitude });
    const aqi = await fetchAQI(latitude, longitude);
    if (aqi != null) {
      sendAQIToESP32(aqi, selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        maximumDate={new Date()}
        onChange={(event, date) => {
          if (date) setSelectedDate(date);
        }}
        style={styles.datePicker}
      />

      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {coords && <Marker coordinate={coords} />}

        {coverageSites.map((site, index) => (
          <Circle
            key={index}
            center={{
              latitude: site.SiteLat,
              longitude: site.SiteLong,
            }}
            radius={25000}
            strokeColor="rgba(0, 150, 0, 0.5)"
            fillColor="rgba(0, 150, 0, 0.2)"
          />
        ))}
      </MapView>

      <AQIPresetList/>

      {aqiInfo && (
        <View style={styles.infoBox}>
          <Text style={styles.title}>AQI: {aqiInfo.AQI}</Text>
          <Text>{aqiInfo.ParameterName} - {aqiInfo.Category.Name}</Text>
          <Text>{aqiInfo.ReportingArea}, {aqiInfo.StateCode}</Text>
          <Text>{aqiInfo.DateObserved}</Text>
        </View>
      )}
    


    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  datePicker: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 10,
  },
  infoBox: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
});

const sendAQIToESP32 = async (aqi: number, date: Date) => {
  const ESP32_IP = "http://172.20.10.4"; // replace with your ESP32's IP

  try {
    const response = await fetch(`${ESP32_IP}/aqi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `aqi=${aqi}&date=${date.toISOString()}`
    });

    const result = await response.text();
    console.log("ESP32 response:", result);
  } catch (err) {
    console.error("Error sending AQI to ESP32:", err);
  }
};
