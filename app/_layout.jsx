import { Drawer } from 'expo-router/drawer'
import 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import DrawerScreen from './drawer'

import React, { useEffect } from 'react'
import { Linking, StatusBar } from 'react-native'
import { RootSiblingParent } from 'react-native-root-siblings'
import Toast from 'react-native-toast-message'
import { Provider } from 'react-redux'
import store from '../store/index'

import { useRouter } from 'expo-router'

export default function RootLayout() {
  // const navigation = useNavigation()
  const router = useRouter()  
  
  // Sanitize initial deep link to avoid expo-router trying to match invalid routes
  useEffect(() => {
    let mounted = true
    async function checkInitialUrl() {
      try {
        const url = await Linking.getInitialURL()
        // Log for debugging on device/builds
        console.log('[RootLayout] initialURL', url)
        if (!mounted) return

        // If url looks like an invalid scheme that expo-router would try to treat as a page
        // (examples seen in the wild: "page:///", ":///"), redirect to app root.
        const lower = url.toLowerCase()
        if (!url || lower.startsWith('page:') || lower.startsWith(':///') || lower === ':///') {
          // navigate to main route to avoid unmatched route errors
          try {
            router.replace('main')
          } catch (e) {
            console.log('[RootLayout] navigation sanitize failed', e)
          }
        }
      } catch (e) {
        console.log('[RootLayout] failed to get initial url', e)
        if (mounted) router.replace('/main')
      }
    }
    checkInitialUrl()
    return () => {
      mounted = false
    }
  }, [router])
  
  function CustomDrawerContent(props) {
    return <DrawerScreen {...props}/>
  }
  return (
    <RootSiblingParent>
      <Provider store={store}>
      <StatusBar
        barStyle="dark-content" // 控制文字图标颜色：light-content / dark-content
        backgroundColor="rgb(255, 255, 255)" // 控制状态栏背景色（仅 Android 生效）
      />
      {/* <SafeAreaProvider> */}
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={['top', 'bottom']}>
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
