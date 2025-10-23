// import { Unmatched } from 'expo-router';
// export default Unmatched;

import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 16 }}>页面不存在</Text>
      <Button title="返回首页" onPress={() => router.push('/')} />
    </View>
  );
}
