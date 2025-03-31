import React, { useState } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

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

  const fetchAQI = async (lat: number, lon: number) => {
    const API_KEY = '87202674-97D8-40A6-8AD2-B998075B6BFA';
    const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lon}&distance=25&API_KEY=${API_KEY}`;

    try {
      const res = await fetch(url);
      const data: AQIReading[] = await res.json();

      if (!data || data.length === 0) {
        Alert.alert("Try clicking closer to a major US city.");
        setAqiInfo(null);
        return;
      }

      const highest = data.reduce((max, reading) =>
        reading.AQI > max.AQI ? reading : max, data[0]
      );

      setAqiInfo(highest);
    } catch (err) {
      console.error("AQI fetch error:", err);
      Alert.alert("Failed to fetch AQI data.");
    }
  };

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCoords({ latitude, longitude });
    await fetchAQI(latitude, longitude);
    if (aqiInfo) {
      sendAQIToESP32(aqiInfo.AQI);
    }
  };

  return (
    <View style={styles.container}>
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
      </MapView>

      {aqiInfo && (
        <View style={styles.infoBox}>
          <Text style={styles.title}>AQI: {aqiInfo.AQI}</Text>
          <Text>{aqiInfo.ParameterName} - {aqiInfo.Category.Name}</Text>
          <Text>{aqiInfo.ReportingArea}, {aqiInfo.StateCode}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
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

const sendAQIToESP32 = async (aqi: number) => {
  const ESP32_IP = "http://172.20.10.6"; // replace with your ESP32's IP

  try {
    const response = await fetch(`${ESP32_IP}/aqi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `aqi=${aqi}`
    });

    const result = await response.text();
    console.log("ESP32 response:", result);
  } catch (err) {
    console.error("Error sending AQI to ESP32:", err);
  }
};

