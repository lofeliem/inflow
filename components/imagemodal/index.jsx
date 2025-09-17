import { useEffect, useRef } from 'react'
import { Animated, Modal, Text, TouchableOpacity } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

export default function ImageModal({ visible, imageUrls, handleClose }) {
  const imgFadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      openModal(imageUrls)
    }
  }, [visible])

  const openModal = (url) => {
    Animated.timing(imgFadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  const closeModal = () => {
    Animated.timing(imgFadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => handleClose())
  }

  return (
    <Modal visible={visible} transparent={true} onRequestClose={closeModal}>
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.9)',
          opacity: imgFadeAnim
        }}
      >
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            right: 30,
            zIndex: 2
          }}
        >
          <Text style={{ color: '#fff', fontSize: 30 }}>×</Text>
        </TouchableOpacity>
        <ImageViewer
          imageUrls={imageUrls}
          index={0}
          enableSwipeDown
          onSwipeDown={closeModal}
          onClick={closeModal}
        />
      </Animated.View>
    </Modal>
  )
}
