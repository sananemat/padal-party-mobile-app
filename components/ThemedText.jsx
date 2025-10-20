import { Text, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'

const ThemedText = ({ style, title = false, ...props }) => {
  const colorScheme = useColorScheme()
  //const theme = Colors[colorScheme] ?? Colors.light

  const textColor = title ? Colors.title : Colors.text

  return (
    <Text 
      style={[{ color: textColor }, style]}
      {...props}
    />
  )
}

export default ThemedText