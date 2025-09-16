import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Button, Text, View } from "react-native";

export default function DrawerPanel() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 24 }}>抽屉内容</Text>
      <Button title="关闭抽屉" onPress={() => navigation.dispatch(DrawerActions.closeDrawer())} />
    </View>
  );
}
