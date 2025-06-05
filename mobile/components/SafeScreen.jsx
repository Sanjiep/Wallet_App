import { View, Text } from 'react-native';
import { COLORS } from '../constants/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SafeScreen = ({children}) => {
    const insets = useSafeAreaInsets()
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1, backgroundColor: COLORS.background }}>
      {children}
    </View>
  )
}

export default SafeScreen