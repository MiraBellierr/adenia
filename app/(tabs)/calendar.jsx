import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from '../../components/CustomButton';
import { createReminder, getAccount } from '../../lib/appwrite';
import { scheduleNotification } from '../../lib/notification';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    router.back();
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const user = await getAccount();
      console.log(user);
      const newReminder = {
        date: selectedDate,
        title: title,
      };

      await createReminder(user.$id, newReminder.title, newReminder.date);

      setReminders([...reminders, newReminder]);
      Alert.alert(`Appointment Scheduled: ${title}, ${selectedDate}`);
      router.navigate("/reminder");

      // Schedule a notification if the reminder date is today
      const today = new Date().toISOString().split('T')[0];
      if (selectedDate === today) {
        await scheduleNotification(
          "Reminder",
          `You have an appointment today: ${title}`,
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create reminder.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToReminders = () => {
    router.navigate("/reminder");
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-[#AFEEEE]`}>
      <View style={tw`flex-row justify-between items-center p-4 bg-blue-600`}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-lg font-semibold`}>Calendar</Text>
        <TouchableOpacity onPress={navigateToReminders}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={tw`flex-1 p-5`}>
        <Calendar
          onDayPress={onDayPress}
          enableSwipeMonths={true}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: '#007AFF' },
          }}
          theme={{
            calendarBackground: '#AFEEEE',
            todayTextColor: '#007AFF',
            arrowColor: '#007AFF',
            textSectionTitleColor: 'black',
            selectedDayBackgroundColor: '#007AFF',
            selectedDayTextColor: 'white',
            dayTextColor: 'black',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            monthTextColor: 'black',
            indicatorColor: 'blue',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
        />
        <View style={tw`mt-5 flex-1`}>
          <Text style={tw`text-2xl font-bold mb-3 text-center text-black`}>Appointment</Text>
          <Text style={tw`mt-4 text-lg text-gray-700`}>Appointment Title:</Text>
          <TextInput
            style={tw`h-12 px-3 border border-gray-700 rounded-lg mt-2 text-black`}
            placeholder="Enter title"
            placeholderTextColor="#808080"
            value={title}
            onChangeText={setTitle}
          />
          <CustomButton
            title="Create"
            containerStyles="w-full py-4 bg-[#007AFF] items-center mt-6 rounded-lg"
            textStyles="text-white text-lg font-semibold"
            handlePress={onSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
