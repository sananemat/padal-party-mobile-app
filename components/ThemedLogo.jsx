import { Image, useColorScheme } from 'react-native'
import DarkLogo from '../assets/ppicon.png'
import LightLogo from '../assets/logo.png'

const ThemedLogo = ({...props}) => {
    const colorScheme = useColorScheme();
    const logo = colorScheme === 'dark' ? DarkLogo : LightLogo;
  return (
    <Image source={logo} {...props}/>
  )
}

export default ThemedLogo