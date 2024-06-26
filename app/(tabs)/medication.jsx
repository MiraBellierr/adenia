import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserMedications, addMedication, deleteMedication } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ManageMedication = () => {
  const { user } = useGlobalContext();
  const [medications, setMedications] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const fetchedMedications = await getUserMedications(user.$id);
      setMedications(fetchedMedications);
    } catch (err) {
      console.error("Failed to fetch medications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

    const goBack = () => {
    router.back();
  };

  const handleAddMedication = async () => {
    if (!medicineName || !dose || !time) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await addMedication(user.$id, medicineName, dose, parseInt(time));
      setMedicineName('');
      setDose('');
      setTime('');
      fetchMedications();
    } catch (err) {
      console.error("Failed to add medication:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedication = async (id) => {
    setLoading(true);
    try {
      await deleteMedication(id);
      fetchMedications();
    } catch (err) {
      console.error("Failed to delete medication:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <View className="bg-white rounded-lg p-4 shadow-md mb-4">
        <Text className="text-2xl font-bold mb-4 text-gray-800">Add Medication</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 text-base"
          placeholder="Medicine name"
          placeholderTextColor="gray"
          value={medicineName}
          onChangeText={setMedicineName}
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 text-base"
          placeholder="How many tablets/pills per take?"
          placeholderTextColor="gray"
          value={dose}
          onChangeText={setDose}
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3 text-base"
          placeholder="How many times per day?"
          placeholderTextColor="gray"
          value={time}
          onChangeText={setTime}
        />
        <TouchableOpacity
          className="bg-blue-600 p-4 rounded-lg items-center mt-4"
          onPress={handleAddMedication}
        >
          <Text className="text-white font-bold text-lg">Add Medication</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={medications}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="bg-white rounded-lg p-4 shadow-md mb-4">
            <Text className="text-xl font-bold mb-2 text-gray-800">{item.medicineName}</Text>
            <Text className="text-base text-gray-600">Dose: {item.dose} tablets/pills</Text>
            <Text className="text-base text-gray-600">Time: {item.time} times</Text>
            <TouchableOpacity
              className="bg-red-600 p-2 rounded-lg items-center mt-2"
              onPress={() => handleDeleteMedication(item.$id)}
            >
              <Text className="text-white font-bold">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ManageMedication;
