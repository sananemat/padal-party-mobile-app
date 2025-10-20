import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import { Stack } from 'expo-router'
import { Colors } from '../constants/Colors'
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '../context/UserContext';

const RootLayout = () => {
    const colorScheme = useColorScheme();
    //const theme = Colors[colorScheme] ?? Colors.light
    
  return (
    <UserProvider>
        <StatusBar value='auto'/>
        <Stack screenOptions={{
            headerStyle: {backgroundColor: Colors.navBackground},
            headerTintColor: Colors.title,
            headerShadowVisible: false
        }}>
          <Stack.Screen name="index" options={{title: 'Home'}}/>
          <Stack.Screen name="test" options={{title: 'Testing',headerShown: false}}/>
          <Stack.Screen name="(auth)" options={{headerShown: false}}/>
          <Stack.Screen name="(player)" options={{headerShown: false}}/>
          <Stack.Screen name="(clubadmin)" options={{headerShown: false}}/>
          
        </Stack>
    </UserProvider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})