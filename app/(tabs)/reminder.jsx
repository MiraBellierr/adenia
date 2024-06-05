import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

      const sortedReminders = fetchedReminders.sort((a, b) => new Date(a.date) - new Date(b.date));
      setReminders(sortedReminders);
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
            await fetchReminders();
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
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity onPress={goBack} className="mt-4 p-2 bg-purple-600 rounded-full">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="bg-blue-600 p-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Appointments</Text>
        <TouchableOpacity onPress={handleAddButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 p-4">
        <ScrollView>
          {reminders.map((reminder) => (
            <View key={reminder.$id} className="mb-4 bg-white p-4 rounded-lg shadow-md">
              <Text className="text-gray-500 mb-1">{new Date(reminder.date).toDateString()}</Text>
              <View className="flex-row justify-between items-center">
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text className="text-black text-lg" numberOfLines={2}>
                    {reminder.title}
                  </Text>
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
