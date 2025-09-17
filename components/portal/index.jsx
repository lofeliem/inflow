import { Text, View } from 'react-native'
import Toast from 'react-native-root-toast'

export default function FloatingToast ({ visible, text }) {
  return (
    <View style={{ flex: 1 }}>
      <Toast
        visible={visible}
        position={80}
        shadow={true}
        animation={true}
        hideOnPress={true}
      >
        <Text style={{ color: '#fff', width: 300, textAlign: 'center' }}>
          {text}
        </Text>
      </Toast>
    </View>
  )
}
