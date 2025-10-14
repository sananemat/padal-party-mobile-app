import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";
import { TabBar } from "../../components/TabBar";

export default function PlayerLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Stack
        screenOptions={{
            headerStyle: {backgroundColor: theme.navBackground},
            headerTintColor: theme.title,
            headerShadowVisible: false,
            headerTitleStyle: {fontSize:24, fontWeight: "bold"},
            headerBackButtonMenuEnabled: false,
            // headerBackTitle: "",
            headerBackButtonDisplayMode: "minimal"
            
            
        }}
    >
      {/* Tabs as the main entry point */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      {/* The standalone screen */}
      <Stack.Screen
        name="career"
        options={{
          title: "Career",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="bookacourt"
        options={{
          title: "Book a Court",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="mybookings"
        options={{
          title: "My Bookings",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
