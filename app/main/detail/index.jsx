import { useRoute } from '@react-navigation/native'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native'
import RenderHTML, {
  defaultHTMLElementModels,
  HTMLContentModel
} from 'react-native-render-html'
import Toast from 'react-native-toast-message'
import { useDispatch } from 'react-redux'
import ImageModal from '../../../components/imagemodal'
import Skeleton from '../../../components/skeleton'
import SmartImage from '../../../components/smartimage'
import { BASE_URL } from '../../../config'
import { setDetailInfo } from '../../../store/detail'

import { timeAgo } from '../../../utils/index'

import { useNavigation } from '@react-navigation/native'

const customHTMLElementModels = {
  video: defaultHTMLElementModels.video.extend({
    contentModel: HTMLContentModel.block
  })
}
const htmlStyles = {
  p: { fontSize: 14, color: '#444', lineHeight: 30 },
  div: { lineHeight: 30, display: 'flex' },
  center: { display: 'flex', alignItems: 'center' }, // 可替代处理 center 标签
  img: {
    maxWidth: '100%',
    height: 300
  },
  h1: {fontSize: 18, fontWeight: 'bold'},
  h2: {fontSize: 18, fontWeight: 'bold'}
}

export default function DetailScreen(onFavorite) {
  const route = useRoute()
  const { _id } = route.params
  const { params } = route.params
  const currentDrawerType = params?.currentDrawerType || 0 // 默认值为0
  const [pageData, setPageData] = useState({})
  const [modalVisible, setModalVisible] = useState(false)
  const [modalImageUrl, setModalImageUrl] = useState([])
  const [imageCount, setImageCount] = useState(0) // 图片数量统计
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    setLoading(true)
    fetch(`${BASE_URL}/inflow/page/${_id}`)
      .then((res) => res.json())
      .then((res) => {
        const data = { ...res.data[0] }
        console.log(data)
        data.content = data.content
          .replace(
            /<center[^>]*data_url="([^"]+)"[^>]*><\/center>/g,
            (_, url) => {
              return `<div style="text-align:center;height: 50px"><img src="${url}" /></div>`
            }
          )
          .replace(/<center[^>]*>/g, '<div style="text-align:center">')
          .replace(/<\/center>/g, '</div>')
          .replace(/<\/?(font|pre)[^>]*>/g, '')

        // 统计图片数量
        const imgMatches = data.content.match(/<img[^>]+src="([^">]+)"/g)
        const count = imgMatches ? imgMatches.length : 0
        setImageCount(count)
        dispatch(setDetailInfo(data))
        setPageData(data)
        setTimeout(() => {
          setLoading(false)
        }, 500)
      })
      .catch((err) => console.log(err))
  }, [_id])

  const { width } = useWindowDimensions()

  const openModal = useCallback((url) => {
    setModalImageUrl([{ url }])
    setModalVisible(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalVisible(false)
  }, [])

  const renderImg = useCallback(
    (props) => {
      const url = props.tnode?.attributes?.src
      // 如果图片数量超过10个，不启用模糊背景
      const showBlurBg = imageCount <= 10

      return (
        <Pressable onPress={() => openModal(url)}>
          <SmartImage imgUrl={url} showBlurBg={showBlurBg} />
        </Pressable>
      )
    },
    [openModal, imageCount]
  )

  const showToast = (isFavorite) => {
    Toast.show({
      type: 'success',
      text1: isFavorite ? '已取消收藏' : '收藏成功',
      topOffset: 80,
      visibilityTime: 1000
    })
  }

  const renderers = useMemo(
    () => ({
      img: renderImg
      // video: VideoPlayer
    }),
    [renderImg]
  )

  const navigation = useNavigation()

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20, backgroundColor: '#fff' }}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
      >
        {!loading ? (
          <View
            style={{ backgroundColor: '#fff', height: 'auto', padding: 10 }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 10
              }}
            >
              <Image
                style={{ width: 20, height: 20, marginTop: 5 }}
                source={{ uri: `${BASE_URL}/inflow${pageData.iconLink}` }}
                resizeMode="contain"
              />
              <Text style={pageStyles.title}>{pageData.title}</Text>
            </View>

            <View style={{marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderColor: 'rgb(242, 242, 242)'}}>
              <Text>author: {pageData.author || 'nobody'} · {timeAgo(pageData.pubDate)}</Text>
            </View>
            {(!pageData.contentSnippet && !pageData.content) && (
              <View style={{marginTop: 20}}>
                <Text style={{fontSize: 14, color: 'rgb(40, 40, 40)'}}>暂无内容，请点击右上角跳转到原文查看......</Text>
              </View>
            )}
            <View style={{ height: 'auto' }}>
              {/* 渲染html */}
              <RenderHTML
                contentWidth={width}
                source={{ html: pageData.content }}
                renderersProps={{
                  img: {
                    enableExperimentalPercentWidth: true,
                    computeEmbeddedMaxWidth: () => width - 20
                  }
                }}
                tagsStyles={htmlStyles}
                renderers={renderers}
                customHTMLElementModels={customHTMLElementModels}
                defaultTextProps={{
                  selectable: true, // 文本可选中
                  style: {
                    // fontSize: 14,
                    // color: '#333',
                    lineHeight: 28
                  }
                }}
              />
            </View>
            <View
              style={{
                color: 'red',
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 1,
                borderColor: 'rgba(234, 234, 234, 1)'
              }}
            >
              <Text>推荐文章：</Text>
            </View>
            {pageData?.recommend?.map((item) => {
              return (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => {
                    navigation.navigate('Detail', {
                      _id: item._id,
                      currentDrawerType
                    })
                  }}
                >
                  <Text
                    style={{
                      color: 'rgba(53, 53, 53, 1)',
                      marginTop: 10,
                      borderBottomWidth: 1,
                      paddingBottom: 3,
                      borderColor: 'rgba(131, 131, 131, 1)'
                    }}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        ) : (
          <Skeleton group={2} />
        )}
      </ScrollView>

      {/* 图片预览 */}
      <ImageModal
        imageUrls={modalImageUrl}
        visible={modalVisible}
        handleClose={closeModal}
      />
    </>
  )
}

const pageStyles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
    paddingLeft: 10,
    paddingRight: 15
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8
  }
})
