import { ImageBackground, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ThemedImageBackground = ({style, safe=false, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light

  if(!safe) return (
    <ImageBackground 
      style={[{backgroundColor: theme.background,}, style]}
      {...props}
    />
  )

  const insets = useSafeAreaInsets()

  return (
    <ImageBackground 
      style={[
        {backgroundColor: theme.background,paddingTop: insets.top, paddingBottom: insets.bottom},
        style,
      ]}
      {...props}
    />
  )
}

export default ThemedImageBackground