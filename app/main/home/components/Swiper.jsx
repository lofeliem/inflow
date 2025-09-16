// https://docs.swmansion.com/react-native-gesture-handler/docs/components/reanimated_swipeable/ 就看这个文档就好了

import { useEffect, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

import { GestureHandlerRootView } from 'react-native-gesture-handler'
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated'
import Toast from 'react-native-root-toast'
import { BASE_URL } from '../../../../config'

export default function MySwiper({
  children,
  item,
  onDelete,
  onFavorite,
  onUnFavorite,
  activeSwiperId,
  setActiveSwiperId,
  currentDrawerType // 0:home   1:favorite   2:later
}) {
  const swiperRef = useRef(null)

  useEffect(() => {
    if (item._id !== activeSwiperId && swiperRef) {
      swiperRef.current && swiperRef.current.close()
    }
  }, [activeSwiperId])
  function RightAction(progress, translation) {
    const styleAnimation = useAnimatedStyle(() => {
      const width = currentDrawerType === 0 ? 240 : 160
      return {
        transform: [{ translateX: translation.value + width }]
      }
    })

    const favoriteItem = async (_id, isFavorite) => {
      fetch(`${BASE_URL}/inflow/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id,
          action: isFavorite ? 0 : 1 // number
        })
      })
        .then((res) => res.json())
        .then((res) => {
          const isUnFavorite = currentDrawerType === 1
          onFavorite && onFavorite(_id, isUnFavorite)
          showToast(isUnFavorite ? '已取消收藏' : '收藏成功')
        })
    }

    const deleteItem = async (_id) => {
      fetch(`${BASE_URL}/inflow/deleteitem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id })
      })
        .then((res) => res.json())
        .then((res) => {
          onDelete && onDelete(_id)
        })
    }

    const showToast = (text) => {
      Toast.show(text, {
        duration: 500,
        position: 80,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: 'black'
      })
    }

    return (
      <Reanimated.View
        style={[
          styleAnimation,
          styles.reanimatedStyle,
          { width: currentDrawerType === 0 ? 240 : 160 }
        ]}
      >
        <TouchableOpacity
          onPress={() => favoriteItem(item._id, item.isFavorite)}
          style={styles.rightAction}
        >
          <Text style={[styles.textStyle, styles.actionOne]}>
            {item.isFavorite ? '取消收藏' : '收藏'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log(1111)}
          style={styles.disabledRightAction}
          disabled={true}
        >
          <Text style={[styles.textStyle, styles.actionSecond]}>已读</Text>
        </TouchableOpacity>
        {currentDrawerType !== 1 && (
          <TouchableOpacity
            onPress={() => deleteItem(item._id)}
            style={styles.rightAction}
          >
            <Text style={[styles.textStyle, styles.actionThird]}>删除</Text>
          </TouchableOpacity>
        )}
      </Reanimated.View>
    )
  }
  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        ref={swiperRef}
        containerStyle={styles.swipeable}
        friction={1}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={RightAction}
        onSwipeableOpen={() => setActiveSwiperId(item._id)}
      >
        {children}
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  rightAction: {
    width: 80, // 只需要按钮宽度
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    // marginTop: 3,
    marginBottom: 3
  },
  disabledRightAction: {
    width: 80, // 只需要按钮宽度
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    // marginTop: 5,
    marginBottom: 3,
    pointerEvents: 'none', // 禁用点击事件
    opacity: 0.3 // 变淡
  },
  textStyle: {
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    // lineHeight: 90,
    height: '100%'
  },
  actionOne: {
    backgroundColor: '#f99d3b'
  },
  actionSecond: {
    backgroundColor: '#4c4c4c'
  },
  actionThird: {
    backgroundColor: '#fa5151'
  },
  reanimatedStyle: {
    width: 240,
    height: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  swipeable: {
    height: '100%'
  }
})
