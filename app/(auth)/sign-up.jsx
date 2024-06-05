import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
import { createUser } from "../../lib/appwrite";

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
  Alert.alert("Error", "Please fill in all the fields.")
    }
    
    setIsSubmitting(true);

    try {
      await createUser(form.email, form.password, form.username);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setIsSubmitting(false);
    }

    createUser();
  };

  return (
     <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="flex-1 justify-start items-center">
          <Image
            source={images.antidote2}
            resizeMode="contain"
            className=""
          />

         
        </View>
        <Text className="text-3xl text-white text-semibold pt-8 px-[20] py-[20]">
          Sign Up
        </Text>
        <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-4 px-[20]"
        />
        
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
            otherStyles="mt-5 px-[20]"
          />

        <View className="flex-1 justify-start items-center pt-8">
        <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
        />
        </View>
        <View className="justify-center pt-14 flex-row gap-2">
          <Text className="text-lg font-psemibold text-white">Already have an account?</Text>
          <Link
            href="/sign-in"
            className="text-lg font-psemibold text-secondary"
          >
            Sign In
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
