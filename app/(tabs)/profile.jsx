import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getAccount } from '../../lib/appwrite';

const AccountScreen = () => {
  const navigation = useNavigation();
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
    navigation.goBack();
  };

  const navigateToEditProfile = () => {
    navigation.navigate('editprofile');
  };

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
      <View style={tw`bg-purple-600 p-6 pb-16 items-center`}>
        <TouchableOpacity onPress={goBack} style={tw`absolute top-5 left-5`}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={tw`bg-purple-700 w-24 h-24 rounded-full justify-center items-center`}>
          <Ionicons name="person" size={64} color="white" />
        </View>
        <Text style={tw`text-white text-2xl mt-4`}>{user.name}</Text>
      </View>
      <View style={tw`p-6`}>
        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons name="person-outline" size={24} color="purple" />
          <Text style={tw`flex-1 ml-4 text-lg`}>{user.name}</Text>
        </View>
        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons name="calendar-outline" size={24} color="purple" />
          <Text style={tw`flex-1 ml-4 text-lg`}>{user.age || 'Age not provided'}</Text>
        </View>
        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons name="call-outline" size={24} color="purple" />
          <Text style={tw`flex-1 ml-4 text-lg`}>{user.phone || 'Phone number not provided'}</Text>
        </View>
        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons name="mail-outline" size={24} color="purple" />
          <Text style={tw`flex-1 ml-4 text-lg`}>{user.email}</Text>
        </View>
        <View style={tw`flex-row items-center mb-4`}>
          <Ionicons name="eye-outline" size={24} color="purple" />
          <Text style={tw`flex-1 ml-4 text-lg`}>********</Text>
        </View>
        <TouchableOpacity onPress={navigateToEditProfile} style={tw`bg-purple-600 p-4 rounded-full items-center mt-6`}>
          <Text style={tw`text-white text-lg`}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;