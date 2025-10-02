import { TextInput, useColorScheme,TouchableOpacity, View } from 'react-native'
import { Colors } from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import ThemedView from './ThemedView';

const ThemedTextInput = ({style, ...props}) => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.dark


  return (
    <TextInput
        style={[
            {
                backgroundColor: theme.uiBackground,
                color: theme.text,
                padding: 20,
                borderRadius: 6,
            },
            style
        ]}
        {...props} 
    />
    
  )
}

export default ThemedTextInput