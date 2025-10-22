import { Drawer } from 'expo-router/drawer'
import 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import DrawerScreen from './drawer'

import { useNavigation } from 'expo-router'
import React from 'react'
import { StatusBar } from 'react-native'
import { useEffect } from 'react'
import { Linking } from 'react-native'
import { RootSiblingParent } from 'react-native-root-siblings'
import Toast from 'react-native-toast-message'
import { Provider } from 'react-redux'
import store from '../store/index'

export default function RootLayout() {
  const navigation = useNavigation()
  
  // Sanitize initial deep link to avoid expo-router trying to match invalid routes
  useEffect(() => {
    let mounted = true
    async function checkInitialUrl() {
      try {
        const url = await Linking.getInitialURL()
        // Log for debugging on device/builds
        console.log('[RootLayout] initialURL', url)
        if (!mounted || !url) return
        // If url looks like an invalid scheme that expo-router would try to treat as a page
        // (examples seen in the wild: "page:///", ":///"), redirect to app root.
        const lower = url.toLowerCase()
        if (lower.startsWith('page:') || lower.startsWith(':///') || lower === ':///') {
          // navigate to main route to avoid unmatched route errors
          try {
            navigation.navigate('main')
          } catch (e) {
            console.log('[RootLayout] navigation sanitize failed', e)
          }
        }
      } catch (e) {
        console.log('[RootLayout] failed to get initial url', e)
      }
    }
    checkInitialUrl()
    return () => {
      mounted = false
    }
  }, [navigation])
  
  function CustomDrawerContent(navigation, ...props) {
    return <DrawerScreen navigation={navigation}/>
  }
  return (
    <RootSiblingParent>
      <Provider store={store}>
      <StatusBar
        barStyle="dark-content" // 控制文字图标颜色：light-content / dark-content
        backgroundColor="rgb(255, 255, 255)" // 控制状态栏背景色（仅 Android 生效）
      />
      {/* <SafeAreaProvider> */}
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen
              name="main"
              options={{ headerShown: false, title: "inflow" }}
            />
          </Drawer>
          <Toast />
        </SafeAreaView>
      {/* </SafeAreaProvider> */}
      </Provider>
    </RootSiblingParent>
  );
}
