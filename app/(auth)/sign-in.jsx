import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { signIn, getCurrentUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-1 justify-start items-center">
          <Image
            source={images.antidote}
            resizeMode="contain"
            className=""
          />

         
        </View>
        <Text className="text-3xl text-white text-semibold pt-8 px-[20] py-[20]">
          Login
        </Text>
        <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-5 px-[20]"
            keyboardType="email-address"
        />
        
        <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7 px-[20]"
        />

        <View className="flex-1 justify-start items-center pt-8">
        <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
        />
        </View>

         <View className="justify-center pt-14 flex-row gap-2">
            <Text className="text-lg font-psemibold text-white">Don't have an account?</Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
