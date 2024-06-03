import { Text, View, Image, ScrollView } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../context/GlobalProvider";

export default function App() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (

    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Text className="font-psemibold text-3xl text-white">ADENIA</Text>

          <Image
            source={images.antidote}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Schedule your planning and ease your way with
            </Text>
            <Text className="text-3xl text-secondary-200">Adenia</Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -left-5"
              resizeMode="contain"
            />
          </View>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
