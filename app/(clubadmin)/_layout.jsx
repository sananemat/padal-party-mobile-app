import { Stack } from "expo-router"
import { StatusBar, useColorScheme } from "react-native"
import { useUser } from "../../hooks/useUser"
import ClubAdminOnly from "../../components/auth/ClubAdminOnly"
import { Colors } from "../../constants/Colors"

export default function ClubAdminLayout() {

  const {user} = useUser()
  //console.log(user)
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.dark

  return (
    <>
      <StatusBar style="auto" />
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
        <Stack.Screen name="cadashboard" options={{title: 'Club Admin Portal' }}/>
        <Stack.Screen name="caprofile" options={{title: 'Club Profile', }}/>
        <Stack.Screen name="cacourts" options={{title: 'Court Management'}}/>
        <Stack.Screen name="cabookings" options={{title: 'Booking Management'}}/>
        <Stack.Screen name="cacourtavailability" options={{title: 'Court Availability'}}/>
        <Stack.Screen name="caanalytics" options={{title: 'Analytics'}}/>
        <Stack.Screen name="catournaments" options={{title: 'Tournaments'}}/>
        <Stack.Screen name="cacreatetourney" options={{title: 'Create Tournament'}}/>
        <Stack.Screen name="cacomms" options={{title: 'Communication'}}/>
        {/* <Stack.Screen name="caprofile" options={{title: 'Testing',headerShown: false}}/> */}
      </Stack>
    </>
  )
}