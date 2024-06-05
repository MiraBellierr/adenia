import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const TabsLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="home"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="calendar"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="reminder"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="editprofile"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="dark" />
    </>
  );
};

export default TabsLayout;
