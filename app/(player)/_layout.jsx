import { Stack } from "expo-router";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { TabBar } from "../../components/TabBar";
import { Colors } from "../../constants/Colors";
import PlayerOnly from "../../components/auth/PlayerOnly";

export default function PlayerLayout() {
  const colorScheme = useColorScheme();
  //const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <PlayerOnly>
      <Stack
          screenOptions={{
              headerStyle: {backgroundColor: Colors.navBackground},
              headerTintColor: Colors.title,
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
        <Stack.Screen
          name="findamatch"
          options={{
            title: "Find a Match",
            headerShown: true,
          }}
        />
      </Stack>
    </PlayerOnly>
  );
}
