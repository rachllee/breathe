import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const AQI_LEVELS = [0, 50, 100, 150, 200, 300, 500];

function getClosestAQI(value: number) {
  return AQI_LEVELS.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

type AqiSliderProps = {
  initialValue?: number;
  onValueChange?: (aqi: number) => void;
};

const AqiSlider: React.FC<AqiSliderProps> = ({ initialValue = 50, onValueChange }) => {
  const [aqi, setAqi] = useState(initialValue);

  const handleComplete = (value: number) => {
    const snapped = getClosestAQI(value);
    setAqi(snapped);
    onValueChange?.(snapped);
  };

  return (
    <View>
      <Text style={styles.label}>Current AQI: {aqi}</Text>

      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={500}
        step={1}
        value={aqi}
        minimumTrackTintColor="#1E90FF"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1E90FF"
        onSlidingComplete={handleComplete}
        onValueChange={setAqi}
      />

      <View style={styles.notchLabels}>
        {AQI_LEVELS.map((level) => (
          <Text key={level} style={styles.notchText}>{level}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  notchLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  notchText: {
    fontSize: 12,
    color: '#555',
  },
});

export default AqiSlider;
