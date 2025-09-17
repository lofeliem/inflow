import { Icon } from '@rneui/themed'
import { Stack } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useTaskSocket from '../../hooks/UseTaskSocket'

import Toast from 'react-native-root-toast'
import { BASE_URL } from '../../config'
import { setDetailInfo } from '../../store/detail'
import { setDialogVisible } from '../../store/dialog'
import { setCurrentFavoriteId } from '../../store/favorite'
import { fetchTaskId } from '../../store/task'

import { Link } from 'expo-router'
import { Linking } from 'react-native'


import {
  Button,
  Dialog,
  Provider as PaperProvider,
  Portal
} from 'react-native-paper'
import { setUpdateData } from '../../store/task'

export default function RootLayout() {
  const detailInfo = useSelector((state) => state.detail.detailInfo) || {}
  const dispatch = useDispatch()

  const handleFavorite = () => {
    fetch(`${BASE_URL}/inflow/favorite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: detailInfo._id,
        action: detailInfo.isFavorite ? 0 : 1 // number
      })
    })
      .then((res) => res.json())
      .then((res) => {
        dispatch(setCurrentFavoriteId(detailInfo._id))
        const obj = JSON.parse(JSON.stringify(detailInfo))
        obj.isFavorite = !detailInfo.isFavorite
        dispatch(setDetailInfo(obj))
        Toast.show(`${detailInfo.isFavorite ? '取消收藏成功' : '收藏成功'}`, {
          duration: Toast.durations.LONG,
          position: 80,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'black'
        })
      })
      .catch((err) => {
        Toast.show(`收藏失败: ${err}`, {
          duration: Toast.durations.LONG,
          position: 80,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red'
        })
      })
  }

  const handleUpdateData = async () => {
    if (taskId) return
    await dispatch(fetchTaskId())
  }

  const taskId = useSelector((state) => state.task.taskId) || ''
  useTaskSocket(taskId)

  const dialogVisible = useSelector((state) => state.dialog.dialogVisible)
  // const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(setDialogVisible(false))
  }

  const handleClickUpdateData = () => {
    dispatch(setDialogVisible(false))
    dispatch(setUpdateData(true))
  }

  return (
    <PaperProvider>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => handleClose()}>
          <Dialog.Title>更新提示</Dialog.Title>
          <Dialog.Content>
            <Text>数据已经拉取完毕，是否现在更新？</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => handleClose()}>取消</Button>
            <Button onPress={() => handleClickUpdateData()}>立即更新</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <Icon
                      name="update"
                      type="material-design-icons"
                      color="rgba(52, 52, 52, 1)"
                      size={20}
                    />
                    {taskId !== '' && (
                      <Text style={{ marginLeft: 5, fontSize: 14 }}>
                        更新中...
                      </Text>
                    )}
                  </TouchableOpacity>
                  <Link
                    href={{ pathname: 'main/search' }}
                    style={{ marginRight: 5 }}
                  >
                    <Icon
                      name="search"
                      type="feather"
                      color="rgb(125, 125, 125)"
                      size={20}
                    />
                  </Link>
                </View>
              </View>
            )
          })}
        />
        <Stack.Screen
          name="detail"
          options={({ navigation }) => ({
            headerShown: true,
            gestureEnabled: false,
            header: () => (
              <View style={styles.header}>
                <View
                  style={styles.headerFront}
                  onPress={() => {
                    navigation.goBack()
                  }}
                >
                  <Icon
                    name="arrow-left"
                    type="feather" // 图标库类型，如 feather、font-awesome、material 等
                    color="black"
                    size={25}
                    onPress={() => {
                      navigation.goBack()
                    }}
                  />
                  <Text style={styles.headerFrontText}>Detail</Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center'
                  }}
                >
                  {detailInfo.isFavorite ? (
                    <Icon
                      name="star"
                      type="font-awesome"
                      color="rgb(254, 221, 73)"
                      size={28}
                      style={{ marginRight: 15 }}
                      onPress={() => handleFavorite()}
                    />
                  ) : (
                    <Icon
                      name="star-o"
                      type="font-awesome"
                      color="rgb(128, 128, 128)"
                      size={28}
                      style={{ marginRight: 15 }}
                      onPress={() => handleFavorite()}
                    />
                  )}
                  <Icon
                    name="article"
                    type="MaterialIcons"
                    color="rgb(128, 128, 128)"
                    size={28}
                    onPress={() => Linking.openURL(detailInfo.link)}
                  />
                </View>
              </View>
            )
          })}
        />
        <Stack.Screen
          name="search"
          options={({ navigation }) => ({
            gestureEnabled: false,
            header: () => <View></View>
          })}
        />
      </Stack>
    </PaperProvider>
  )
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
