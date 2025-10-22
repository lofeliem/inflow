// import { Drawer } from 'expo-router/drawer'
// import 'react-native-reanimated'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import DrawerScreen from './drawer'

// import { useNavigation } from 'expo-router'
// import React from 'react'
// import { StatusBar } from 'react-native'
// import { RootSiblingParent } from 'react-native-root-siblings'
// import Toast from 'react-native-toast-message'
// import { Provider } from 'react-redux'
// import store from '../store/index'

// export default function RootLayout() {
//   const navigation = useNavigation()
  
//   function CustomDrawerContent(navigation, ...props) {
//     return <DrawerScreen navigation={navigation}/>
//   }
//   return (
//     <RootSiblingParent>
//       <Provider store={store}>
//       <StatusBar
//         barStyle="dark-content" // 控制文字图标颜色：light-content / dark-content
//         backgroundColor="rgb(255, 255, 255)" // 控制状态栏背景色（仅 Android 生效）
//       />
//       {/* <SafeAreaProvider> */}
//         <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//           <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
//             <Drawer.Screen
//               name="main"
//               options={{ headerShown: false, title: "inflow" }}
//             />
//           </Drawer>
//           <Toast />
//         </SafeAreaView>
//       {/* </SafeAreaProvider> */}
//       </Provider>
//     </RootSiblingParent>
//   );
// }
