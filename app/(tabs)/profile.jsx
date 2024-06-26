import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getAccount } from '../../lib/appwrite';

const AccountScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const account = await getAccount();
        setUser(account);
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

  const navigateToEditProfile = () => {
    router.navigate("/editprofile");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F5F5F5]">
        <ActivityIndicator size="large" color="#6200EA" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#F5F5F5]">
        <Text className="text-red-500">{error}</Text>
        <TouchableOpacity onPress={goBack} className="mt-4 p-2 bg-[#6200EA] rounded-full">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5F5F5]">
      <View className="bg-[#6200EA] p-6 pb-16 items-center relative">
        <TouchableOpacity onPress={goBack} className="absolute top-5 left-5">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="bg-[#7E57C2] w-24 h-24 rounded-full justify-center items-center">
          <Ionicons name="person" size={64} color="white" />
        </View>
        <Text className="text-white text-2xl mt-4 font-bold">{user.name}</Text>
      </View>
      <View className="p-6">
        <View className="flex-row items-center mb-4">
          <Ionicons name="person-outline" size={24} color="#6200EA" />
          <Text className="flex-1 ml-4 text-lg text-gray-800">{user.name}</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Ionicons name="calendar-outline" size={24} color="#6200EA" />
          <Text className="flex-1 ml-4 text-lg text-gray-800">{user.age || 'Age not provided'}</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Ionicons name="call-outline" size={24} color="#6200EA" />
          <Text className="flex-1 ml-4 text-lg text-gray-800">{user.phone || 'Phone number not provided'}</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Ionicons name="mail-outline" size={24} color="#6200EA" />
          <Text className="flex-1 ml-4 text-lg text-gray-800">{user.email}</Text>
        </View>
        <View className="flex-row items-center mb-4">
          <Ionicons name="eye-outline" size={24} color="#6200EA" />
          <Text className="flex-1 ml-4 text-lg text-gray-800">********</Text>
        </View>
        <TouchableOpacity onPress={navigateToEditProfile} className="bg-[#6200EA] p-4 rounded-full items-center mt-6 shadow-md">
          <Text className="text-white text-lg font-semibold">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
