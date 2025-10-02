import { Tabs } from "expo-router"
import { useColorScheme } from "react-native"
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { TabBar } from "../../components/TabBar";
import PlayerOnly from "../../components/auth/PlayerOnly";

export default function PlayerLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light
  return (
    <>
      <Tabs tabBar={props => <TabBar {...props}/>}
        screenOptions={{ 
            headerShown: false, 
            tabBarStyle:{
              backgroundColor: theme.navBackground,
              padding: 10,
              height: 90,
              borderTopWidth: 0
            },
            tabBarActiveTintColor: theme.iconColorFocused,
            tabBarInactiveTintColor: theme.iconColor
          }} 
      >
        <Tabs.Screen 
          name="home" 
          options={{title: 'Home'}}
        />
        <Tabs.Screen 
          name="create" 
          options={{title: 'Create'}}
        />
        
        <Tabs.Screen 
          name="profile" 
          options={{title: 'Profile'}}
        />
        
      </Tabs>
    </>
  )
}