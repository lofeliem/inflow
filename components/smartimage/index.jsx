import { Image } from 'expo-image'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

export default function SmartImage({ imgUrl, showBlurBg }) {
  const [imgLoading, setImgLoading] = useState(false)

  const onLoadStart = () => {
    console.log('onLoadStart')
    setImgLoading(true)
  }

  const onLoadEnd = () => {
    setImgLoading(false)
  }

  const onloadError = (err) => {
    console.log('onloadError', err)
  }

  return (
    <View style={styles.box}>
      {/* 模糊背景 */}
      <Image
        source={{ uri: imgUrl }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        blurRadius={20}
      />
      {/* 正式图 */}
      <Image
        source={{ uri: imgUrl }}
        style={styles.img}
        contentFit="contain"
        placeholder={require("../../assets/default.jpg")}
        placeholderContentFit="cover"
        transition={300}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    position: 'relative',
    width: '100%',
    height: 300
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 300
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // 填满整个容器
    width: '100%',
    height: '100%'
  }
})
