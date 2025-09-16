import { Icon } from '@rneui/themed';
import { Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={({ navigation }) => ({
          gestureEnabled: false,
          header: () => (
            <View style={styles.header}>
              <View style={styles.headerFront}>
                <TouchableOpacity
                  onPress={() => navigation.openDrawer()}
                  style={{ marginRight: 5 }}
                >
                  <Icon
                    name="menu"
                    type="feather" // 图标库类型，如 feather、font-awesome、material 等
                    color="rgb(58, 58, 58)"
                    size={25}
                  />
                </TouchableOpacity>
                <Text style={styles.headerFrontText}>inflow</Text>
              </View>
              <View style={styles.headerFront}>
                <TouchableOpacity
                  onPress={() => handleUpdateData()}
                  style={{
                    marginRight: 30,
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Icon
                    name="update"
                    type="material-design-icons"
                    color="rgba(52, 52, 52, 1)"
                    size={20}
                  />
                  {/* {taskId !== "" && (
                    <Text style={{ marginLeft: 5, fontSize: 14 }}>
                      更新中...
                    </Text>
                  )} */}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Search")}
                  style={{ marginRight: 5 }}
                >
                  <Icon
                    name="search"
                    type="feather"
                    color="rgb(125, 125, 125)"
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ),
        })}
      />
      <Stack.Screen name="detail" options={{ title: "Detail" }} />
      <Stack.Screen
        name="search"
        options={{ headerShown: false, title: "Search" }}
      />
    </Stack>
  );
}


const styles = StyleSheet.create({
  header: {
    height: 40,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    marginBottom: 5,
    // backgroundColor: 'rgb(242, 246, 252)',
    borderBottomWidth: 1,
    borderColor: '#dcdfe6'
  },
  headerFront: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  headerFrontText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  }
})