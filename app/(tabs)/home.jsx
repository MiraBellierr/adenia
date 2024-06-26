import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { getUserReminders, getUserMedications, signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [nextReminder, setNextReminder] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNextReminder = async () => {
    try {
      const fetchedReminders = await getUserReminders(user.$id);
      const sortedReminders = fetchedReminders.sort((a, b) => new Date(a.date) - new Date(b.date));
      setNextReminder(sortedReminders[0]);
    } catch (err) {
      console.error("Failed to fetch reminders:", err);
    }
  };

  const fetchMedications = async () => {
    try {
      const fetchedMedications = await getUserMedications(user.$id);
      setMedications(fetchedMedications);
    } catch (err) {
      console.error("Failed to fetch medications:", err);
    }
  };

  useEffect(() => {
    fetchNextReminder();
    fetchMedications();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  const handleMyAccountClick = () => {
    router.navigate("/profile");
  };

  const handleCalendarClick = () => {
    router.navigate("/calendar");
  };

  const handleMedicationClick = () => {
    router.navigate("/reminder");
  };

  const handleManageMedicationClick = () => {
    router.navigate("/medication");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gray-100">
      <View className="w-full h-full max-w-md bg-white rounded-lg overflow-hidden shadow-md">
        <View className="bg-blue-700 w-full h-1/3 rounded-b-lg relative px-4 py-6">
          <TouchableOpacity
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white items-center justify-center shadow-md"
            onPress={handleMyAccountClick}
          >
            <Text className="text-blue-700 text-center">👤</Text>
          </TouchableOpacity>
          <Text className="text-white text-4xl font-bold mt-6">
            Dashboard
          </Text>
          <Text className="text-white text-lg mt-2">
            Welcome, {user.name}
          </Text>
          {nextReminder && (
            <View className="bg-white rounded-lg p-4 shadow-md mt-4">
              <Text className="text-blue-700 text-lg font-semibold">Next Appointment</Text>
              <Text className="text-gray-800 text-base mt-2">{nextReminder.title} on {new Date(nextReminder.date).toLocaleDateString()}</Text>
            </View>
          )}
        </View>
        <View className="mt-12 px-6 flex-1">
          <View className="flex-row justify-between mb-8">
            <TouchableOpacity
              className="bg-white p-4 rounded-lg items-center shadow-md flex-1 mx-2"
              onPress={handleMyAccountClick}
            >
              <Image source={images.profileIcon} className="w-12 h-12" />
              <Text className="text-sm mt-2">My Account</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white p-4 rounded-lg items-center shadow-md flex-1 mx-2"
              onPress={handleCalendarClick}
            >
              <Image source={images.calendar} className="w-12 h-12" />
              <Text className="text-sm mt-2">Calendar</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-white p-4 rounded-lg items-center shadow-md mx-2 mb-8"
            onPress={handleMedicationClick}
          >
            <Image source={images.tick} className="w-12 h-12" />
            <Text className="text-sm mt-2">Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white p-4 rounded-lg items-center shadow-md mx-2"
            onPress={handleManageMedicationClick}
          >
            <Image source={images.pill} className="w-12 h-12" />
            <Text className="text-sm mt-2">Manage Medication</Text>
          </TouchableOpacity>
        </View>
        <CustomButton
          title="Log Out"
          containerStyles="w-full py-4 bg-red-600 items-center"
          textStyles="text-white font-semibold"
          handlePress={logout}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
