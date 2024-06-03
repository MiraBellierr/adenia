import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserReminders, getAccount, deleteReminder } from '../../lib/appwrite';
import { router } from 'expo-router';

const MedicationScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   const fetchReminders = async () => {
        try {
        const fetchedAccount = await getAccount();
        const fetchedReminders = await getUserReminders(fetchedAccount.$id);
        setReminders(fetchedReminders);
      } catch (err) {
        setError(err.message || 'Failed to fetch reminders.');
      } finally {
        setLoading(false);
      }
    };


  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDelete = (id) => {
    Alert.alert('Delete Reminder', `Delete reminder with ID: ${id}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK', onPress: async () => {
          try {
            setLoading(true);
            await deleteReminder(id);
            await fetchReminders(); // Refresh reminders after deletion
            setLoading(false);
          } catch (err) {
            console.error('Failed to delete reminder:', err);
            setLoading(false);
          }
        }
      },
      ]);
  };

  const goBack = () => {
      router.back();
    };
    
    const handleAddButton = () => {
        router.navigate("/calendar");
    }

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-[#AFEEEE]`}>
        <ActivityIndicator size="large" color="purple" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center bg-[#AFEEEE]`}>
        <Text style={tw`text-red-500`}>{error}</Text>
        <TouchableOpacity onPress={goBack} style={tw`mt-4 p-2 bg-purple-600 rounded-full`}>
          <Text style={tw`text-white`}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-[#AFEEEE]`}>
      <View style={tw`bg-blue-600 p-6 items-center flex-row justify-between`}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={tw`text-white text-lg`}>Appointments</Text>
        <TouchableOpacity onPress={handleAddButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={tw`p-4`}>
        <ScrollView>
          {reminders.map((reminder) => (
            <View key={reminder.$id} style={tw`mb-4`}>
              <Text style={tw`text-gray-500 mb-2`}>{reminder.date}</Text>
              <View style={tw`flex-row justify-between items-center p-2 border-b border-gray-300`}>
                <View>
                  <Text style={tw`text-black text-lg`}>{reminder.title}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(reminder.$id)}>
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MedicationScreen;
