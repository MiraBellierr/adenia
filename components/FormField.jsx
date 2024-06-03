import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-3 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="focus:border-secondary items-center"></View>

      <TextInput
        className="text-white font-psemibold text-base border-b-2 border-white mr-6"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7B7B8B"
        onChangeText={handleChangeText}
        secureTextEntry={title === "Password" && !showPassword}
      />

      {title === "Password" && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={!showPassword ? icons.eyeHide : icons.eye}
            className="w-7 h-7 right-[20] absolute bottom-[30]"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FormField;
