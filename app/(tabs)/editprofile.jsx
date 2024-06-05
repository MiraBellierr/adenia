// screens/EditProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getAccount, updateProfile } from '../../lib/appwrite';

const EditProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const account = await getAccount();
        setUser(account);
        setUsername(account.name || '');
        setAge(account.age ? account.age.toString() : '');
        setPhone(account.phone ? account.phone.toString() : '');
      } catch (err) {
        setError(err.message || 'Failed to fetch user information.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const goBack = () => {
    router.back();
  };

  const handleSaveProfile = async () => {
    if (!username || !age || !phone) {
      Alert.alert('Please fill out all fields.');
      return;
    }

    setLoading(true);

    try {
      await updateProfile(user.accountId, username, parseInt(age), phone);
      Alert.alert('Profile updated successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Failed to update profile', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#AFEEEE]">
        <ActivityIndicator size="large" color="purple" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#AFEEEE]">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity onPress={goBack} className="mt-4 p-2 bg-purple-600 rounded-full">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1 bg-[#AFEEEE]">
        <View className="bg-purple-600 p-6 pb-16 items-center">
          <TouchableOpacity onPress={goBack} className="absolute top-5 left-5">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className="bg-purple-700 w-24 h-24 rounded-full justify-center items-center">
            <Ionicons name="person" size={64} color="white" />
          </View>
          <Text className="text-white text-2xl mt-4">{user.name}</Text>
        </View>
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="person-outline" size={24} color="purple" />
            <TextInput
              className="flex-1 ml-4 text-lg border-b border-purple-600"
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
          </View>
          <View className="flex-row items-center mb-4">
            <Ionicons name="calendar-outline" size={24} color="purple" />
            <TextInput
              className="flex-1 ml-4 text-lg border-b border-purple-600"
              value={age}
              onChangeText={setAge}
              placeholder="Age"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-row items-center mb-4">
            <Ionicons name="call-outline" size={24} color="purple" />
            <TextInput
              className="flex-1 ml-4 text-lg border-b border-purple-600"
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              keyboardType="phone-pad"
            />
          </View>
          <View className="flex-row items-center mb-4">
            <Ionicons name="mail-outline" size={24} color="purple" />
            <Text className="flex-1 ml-4 text-lg">{user.email}</Text>
          </View>
          <View className="flex-row items-center mb-4">
            <Ionicons name="eye-outline" size={24} color="purple" />
            <Text className="flex-1 ml-4 text-lg">********</Text>
          </View>
          <TouchableOpacity onPress={handleSaveProfile} className="bg-purple-600 p-4 rounded-full items-center mt-6">
            <Text className="text-white text-lg">Save Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default EditProfileScreen;
