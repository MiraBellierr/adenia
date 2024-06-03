import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import CustomButton from '../../components/CustomButton';
import { createReminder, getAccount, getUserReminders } from '../../lib/appwrite';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [title, setTitle] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchReminders = async () => {
      const user = await getAccount();
      const reminders = await getUserReminders(user.$id);
      const newMarkedDates = {};

      reminders.forEach(reminder => {
        newMarkedDates[reminder.date] = {
          marked: true,
          dotColor: 'red',
          selectedColor: 'blue',
        };
      });

      setMarkedDates(newMarkedDates);
    };

    fetchReminders();
  }, []);

  const goBack = () => {
    router.back();
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const onSubmit = async () => {
    const user = await getAccount();
    const newReminder = {
      date: selectedDate,
      title: title,
    };

    await createReminder(user.$id, newReminder.title, newReminder.date);

    setMarkedDates({
      ...markedDates,
      [selectedDate]: {
        marked: true,
        dotColor: 'red',
        selectedColor: 'blue',
      }
    });

    Alert.alert(`Appointment Scheduled: ${title}, ${selectedDate}`);
    router.navigate("/reminder");
  };

  const navigateToReminders = () => {
    router.navigate("/reminder");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#AFEEEE]`}>
      <View style={tw`flex-row justify-between items-center p-4 bg-blue-600`}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-lg`}>CALENDAR</Text>
        <TouchableOpacity onPress={navigateToReminders}>
          <Ionicons name="menu" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={tw`flex-1 p-5`}>
        <Calendar
          onDayPress={onDayPress}
          enableSwipeMonths={true}
          monthFormat={'d MMM yyyy'}
          markedDates={{
            ...markedDates,
            [selectedDate]: { selected: true, selectedColor: 'blue', marked: true },
          }}
          theme={{
            calendarBackground: '#AFEEEE',
            todayTextColor: 'red',
            arrowColor: 'blue',
          }}
        />
        <View style={tw`mt-5 flex-1`}>
            <Text style={tw`text-2xl font-bold mb-3 text-center`}>Appointment</Text>
            <Text className="mt-4">Appointment Title: </Text>
            <TextInput
              style={tw`h-10 border-b border-black`}
              placeholderTextColor="#808080"
              value={title}
              onChangeText={setTitle}
            />
          <CustomButton
            title="Create"
            containerStyles="w-full py-4 bg-[#00BFFF] items-center absolute bottom-0"
            textStyles="text-black"
            handlePress={onSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
