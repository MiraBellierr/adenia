import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

import { signOut } from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalProvider"

const Home = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

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

  const handleProfileIconClick = () => {
    router.navigate("/profile");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#AFEEEE]">
        <View className="w-full h-full max-w-md bg-[#AFEEEE] rounded-lg overflow-hidden relative shadow-md">
          <View className="bg-blue-600 w-full h-1/3 rounded-b-lg relative">
            <TouchableOpacity
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black items-center justify-center" onPress={handleProfileIconClick}>
              <Text className="text-white text-center">👤</Text>
            </TouchableOpacity>
            <Text className="text-white text-3xl font-semibold absolute top-1/3 left-4">
              Dashboard
            </Text>
          </View>
          <View className="mt-12 px-4 flex-1">
            <View className="flex-row justify-between mb-8">
              <TouchableOpacity className=" bg-[#AFEEEE] p-4 rounded-lg items-center shadow-md left-[30]" onPress={handleMyAccountClick}>
                <Image source={ images.profileIcon } className="w-12 h-12" />
                <Text>My Account</Text>
              </TouchableOpacity>
              <TouchableOpacity className=" bg-[#AFEEEE] p-4 rounded-lg items-center shadow-md px-[30] mx-[110] right-[10]" onPress={handleCalendarClick}>
                <Image source={ images.calendar } className="w-12 h-12" />
                <Text>Calendar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-[#AFEEEE] p-4 rounded-lg items-center shadow-md mx-[110]" onPress={handleMedicationClick}>
              <Image source={ images.pill } className="w-12 h-12" />
              <Text>Appointment</Text>
            </TouchableOpacity>
          </View>
        <CustomButton
          title="Log Out"
          containerStyles="w-full py-4 bg-red-600 items-center"
          textStyles="text-black"
          handlePress={logout}
        />

        </View>
      </SafeAreaView>
  );
};

export default Home;
