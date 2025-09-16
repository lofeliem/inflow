import { useNavigation } from '@react-navigation/native'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View
} from 'react-native'
import { useSelector } from 'react-redux'
import { BASE_URL } from '../../../config'
import { timeAgo } from '../../../utils/'
import MySwiper from './components/Swiper'

export default function HomeScreen() {
  const [list, setList] = useState([])
  const pageSize = useRef(50)
  const pageNum = useRef(1)
  const pageId = useRef(null)
  const pagePubDate = useRef(null)
  const [hasData, setHasData] = useState(true)
  const loading = useRef(false) // 用来处理调api疯狂触底加载Bug
  const cursor = useRef({})
  const filterCursor = useRef({})
  const [activeSwiperId, setActiveSwiperId] = useState('')
  const favoritePageIndex = useRef(0)

  const filterSourcesIds = useSelector((state) => state.drawer.filterSourcesIds)
  const isSelectAll = useSelector((state) => state.drawer.isSelectAll)
  const currentFavoriteId = useSelector(
    (state) => state.favorite.currentFavoriteId
  )

  const currentDrawerType = useSelector(
    (state) => state.drawer.currentDrawerType
  )

  const toggleSearch = useSelector((state) => state.search.toggleSearch)
  const sourcesList = useSelector((state) => state.drawer.sourcesList)

  const colorScheme = useColorScheme() // 'light' | 'dark' | null 深色模式浅色模式
  console.log('深色模式/浅色模式', colorScheme)

  const fetchData = () => {
    console.log('触底加载数据', hasData, isSelectAll)
    if (loading.current) return // 如果正在重置数据，则不执行加载更多
    if (hasData && isSelectAll && currentDrawerType == 0) fetchApi() // 获取正常homelist
    else if (hasData && !isSelectAll) {
      // 获取过滤的list
      fetchFilterApi()
    } else if (hasData && currentDrawerType == 1) {
      // 获取收藏列表
      fetchFavoriteApi()
    }
  }

  const updateData = useSelector((state) => state.task.updateData)

  useEffect(() => {
    console.log(
      `当前列表是${
        currentDrawerType == 0
          ? '全选或筛选'
          : currentDrawerType == 1
          ? '收藏'
          : '稍后看'
      }`,
      currentDrawerType
    )
    loading.current = true
    filterCursor.current = {}
    cursor.current = {}
    favoritePageIndex.current = 0
    setHasData(true)
    setList([])
    pageNum.current = 1
    if (currentDrawerType == 1) fetchFavoriteApi()
  }, [currentDrawerType])

  useEffect(() => {
    if (!currentFavoriteId) return
    if (currentDrawerType == 1) {
      setList((prev) => prev.filter((item) => item._id !== currentFavoriteId))
    } else {
      setList((prev) =>
        prev.map((item) =>
          item._id === currentFavoriteId
            ? { ...item, isFavorite: !item.isFavorite }
            : item
        )
      )
    }
  }, [currentFavoriteId, currentDrawerType])

  useEffect(() => {
    console.log('主流程触发', filterSourcesIds, isSelectAll, updateData)
    // 如果是全选就正常获取，否则就根据筛选的数据请求
    loading.current = true
    filterCursor.current = {}
    cursor.current = {}
    setHasData(true)
    setList([])
    pageNum.current = 1
    if (isSelectAll) fetchApi()
    else fetchFilterApi()
  }, [filterSourcesIds, isSelectAll, updateData])

  const fetchApi = () => {
    loading.current = true
    filterCursor.current = {}
    fetch(`${BASE_URL}/inflow/homelist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cursor: cursor.current,
        pageSize: pageSize.current,
        sourcePageIndex: pageNum.current
      })
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data)
        res = res.data
        cursor.current = res.cursor
        if (res.data.length === 0) setHasData(false)
        const newList = JSON.parse(JSON.stringify(res.data))
        setList((prev) => [...prev, ...res.data])
        if (newList.length > 0) {
          const lastId = newList[newList.length - 1]._id
          const lastPubDate = newList[newList.length - 1].pubDate
          pageId.current = lastId
          pagePubDate.current = lastPubDate
          pageNum.current++
        }
        loading.current = false
      })
      .catch((err) => console.log(err))
  }

  // 获取筛选源后的数据
  const fetchFilterApi = () => {
    loading.current
    cursor.current = {}
    fetch(`${BASE_URL}/inflow/filterlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cursor: filterCursor.current,
        pageSize: pageSize.current,
        sourcePageIndex: pageNum.current,
        filterSourcesIds
      })
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('✅--filter-res', res.data)
        res = res.data
        filterCursor.current = res.cursor
        if (res.data.length === 0) setHasData(false)
        const newList = JSON.parse(JSON.stringify(res.data))
        setList((prev) => [...prev, ...res.data])
        if (newList.length > 0) {
          const lastId = newList[newList.length - 1]._id
          const lastPubDate = newList[newList.length - 1].pubDate
          pageId.current = lastId
          pagePubDate.current = lastPubDate
          pageNum.current++
        }
        loading.current = false
      })
      .catch((err) => console.log(err))
  }

  // 获取收藏列表
  const fetchFavoriteApi = () => {
    loading.current = true
    filterCursor.current = {}
    favoritePageIndex.current++
    fetch(`${BASE_URL}/inflow/getFavoritelist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pageSize: pageSize.current,
        pageIndex: favoritePageIndex.current
      })
    })
      .then((res) => res.json())
      .then((res) => {
        res = res.data
        cursor.current = res.cursor
        if (res.data.length < pageSize.current) setHasData(false)
        const newList = JSON.parse(JSON.stringify(res.data))
        setList((prev) => [...prev, ...res.data])
        if (newList.length > 0) {
          const lastId = newList[newList.length - 1]._id
          const lastPubDate = newList[newList.length - 1].pubDate
          pageId.current = lastId
          pagePubDate.current = lastPubDate
          pageNum.current++
        }
        loading.current = false
      })
      .catch((err) => console.log(err))
  }

  const RenderFooter = () => {
    return !hasData ? (
      <Text style={{ textAlign: 'center', padding: 10, color: '#888', fontSize: 12 }}>
        没有更多内容了......
      </Text>
    ) : loading.current ? (
      <ActivityIndicator style={{ padding: 10 }} />
    ) : null
  }

  const handleDelete = (_id) => {
    setList((prev) => prev.filter((item) => item._id !== _id))
  }

  const handleFavorite = (_id, isUnFavorite = false) => {
    if (isUnFavorite) {
      setList((prev) => prev.filter((item) => item._id !== _id))
      return
    } else {
      setList((prev) =>
        prev.map((item) =>
          item._id == _id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      )
    }
  }

  const RenderItem = ({ item }) => (
    <MySwiper
      item={item}
      onDelete={handleDelete}
      onFavorite={handleFavorite}
      activeSwiperId={activeSwiperId}
      setActiveSwiperId={setActiveSwiperId}
      currentDrawerType={currentDrawerType}
    >
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate('Detail', {
            _id: item._id,
            currentDrawerType
          })
        }
      >
        <View style={feedItemstyles.card}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              paddingRight: 12
            }}
          >
            {/* <Image
              style={{ width: 20, height: 20, marginTop: 5 }}
              source={{ uri: `${BASE_URL}/inflow${item.iconLink}` }}
              resizeMode="contain"
            /> */}
            <Image
              style={{ width: 20, height: 20, marginTop: 5 }}
              source={{
                uri: item.iconLink ? (`${
                  item.iconLink.startsWith('/icons')
                    ? `${BASE_URL}/inflow${item.iconLink}`
                    : item.iconLink
                }`) : ''
              }}
              resizeMode="contain"
            />
            <View>
              <View
                style={{
                  fontSize: 12,
                  backgroundColor: '#f3f3f3ff',
                  padding: 2,
                  marginLeft: 6,
                  marginBottom: 2,
                  borderLeftWidth: 4,
                  borderLeftColor: '#d6d6d6ff',
                  borderLeftStyle: 'solid',
                  alignSelf: 'flex-start'
                }}
              >
                {item.rssUrlId && (
                  <Text style={{ fontSize: 10, color: '#666', alignSelf: 'flex-start' }}>
                    {sourcesList.find((source) => source._id === item.rssUrlId)?.title}
                  </Text>
                )}
                {item.feedUrlId && (
                  <Text style={{ fontSize: 10, color: '#666' }}>
                    {sourcesList.find((source) => source._id === item.feedUrlId)?.title}
                  </Text>
                )}
              </View>
              <Text style={[feedItemstyles.title, { marginLeft: 6 },
                {color: item._6HoursNews ? '#1E88E5' : (item._24HoursNews ? '#43A047' : '')},
                {backgroundColor: item._6HoursNews ? '#E3F2FD' : (item._24HoursNews ? '#E8F5E9' : '')}
              ]} >
                {item.title}
              </Text>
            </View>
          </View>

          <Text style={feedItemstyles.meta}>
            作者：{item.author} · {timeAgo(item.pubDate)}
          </Text>
          <View
            style={{
              maxHeight: 150,
              overflow: 'hidden',
              whiteSpace: 'break-spaces'
            }}
          >
            <Text
              style={{
                verflow: 'hidden',
                whiteSpace: 'break-spaces',
                fontSize: 11,
                lineHeight: 18
              }}
              numberOfLines={3}
            >
              {item.summary}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </MySwiper>
  )

  const navigation = useNavigation()

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        onEndReached={fetchData}
        onEndReachedThreshold={0.2}
        // contentContainerStyle={{ paddingBottom: 20 }}
        ListFooterComponent={RenderFooter}
        renderItem={RenderItem}
        initialNumToRender={3} // 初始渲染数量
        windowSize={5} // 窗口大小（上下两个窗口）
        maxToRenderPerBatch={10} // 最大渲染数量
      />
    </View>
  )
}

const feedItemstyles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#234562',
    padding: 10,
    margin: 10,
    marginRight: 0
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
    alignSelf: 'flex-start',
    marginLeft: 20,
    flexWrap: 'wrap',
    wordBreak: 'break-word',
    padding: 2
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 3,
    // marginTop: 3,
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 12,
    paddingTop: 5,
    paddingBottom: 5,
    // ios
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    maxHeight: 600,
    overflow: 'hidden',
    whiteSpace: 'break-spaces'
  },
  meta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5
  }
})
