import React, {useRef, useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StyleSheet, View, TouchableOpacity, Animated, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
    selectedDate: Date,
    setSelectedDate: (date: Date) => void;
}
const DatePicker = ({selectedDate, setSelectedDate}: Props) => {
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

    return <View style={styles.container}>
          <TouchableOpacity style={{padding: 10}} onPress={() => setIsVisible(prev => !prev)}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Ionicons name="chevron-up" size={24} color="#000" />
            </Animated.View>
          </TouchableOpacity>
        <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            maximumDate={new Date()}
            onChange={(event, date) => {
              if (date) setSelectedDate(date);
            }}
            style={styles.datePicker}/>
    </View>
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 30,
        left: 10,
        alignItems: 'flex-end',
        borderRadius: 10,
        backgroundColor: 'white'
      },
  datePicker: {
    // position: 'absolute',
    // top: 50,
    // left: 20,
    // right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 10,
}});

export default DatePicker;