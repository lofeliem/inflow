import { useNavigation } from '@react-navigation/native'
import { Icon, SearchBar, Skeleton, Tab, TabView } from '@rneui/themed'
import { useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ListFooter from '../../../components/listfooter/index'
import MyToast from '../../../components/portal/index'
import { fetchSearch, setToggleSearch } from '../../../store/search'
import RenderApiItem from './components/renderApiItem'
import RenderDBItem from './components/renderDBItem'

export default function Search() {
  const [visible, setVisible] = useState(false)
  const searchValue = useState('')
  const debounceTimer = useRef(null)
  const [loading, setLoading] = useState(false)
  const [tabIndex, setTabIndex] = useState(0)
  const [noneSearching, setNoneSearching] = useState(true)
  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState('')

  const searchData = useSelector((state) => state.search.searchData)
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const toggleOverlay = () => {
    dispatch(setToggleSearch(false))
  }


  const fetchSearchResults = async () => {
    setLoading(true)
    setNoneSearching(false)
    await dispatch(fetchSearch(searchValue))
    setLoading(false)
  }

  const handleSearchInputChange = (value) => {
    console.log('触发了input', value)
    searchValue.current = value
    if (!value) {
      setNoneSearching(true)
      return
    }
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      fetchSearchResults()
    }, 300)
  }

  const Content = useMemo(() => {
    let content = null
    if (noneSearching) {
      content = null
    } else if (!noneSearching && loading) {
      content = (
        <View
          style={{
            marginTop: 20,
            height: '40%',
            justifyContent: 'space-around'
          }}
        >
          {[1, 2, 3].map((item, idx) => (
            <View key={idx} style={{ marginBottom: 30 }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Skeleton circle animation="wave" width={30} height={30} />
                <Skeleton animation="wave" width={'88%'} height={15} />
              </View>
              <View style={{ marginTop: 10 }}>
                <Skeleton animation="wave" width={'100%'} height={20} />
              </View>
            </View>
          ))}
        </View>
      )
    } else if (!noneSearching && !loading) {
      content = (
        <View style={{ height: '100%', flex: 1, overflow: 'hidden' }}>
          <Tab
            value={tabIndex}
            onChange={(e) => {
              console.log(e)
              setTabIndex(e)
            }}
            dense
            indicatorStyle={{
              backgroundColor: 'rgb(102, 177, 255)',
              height: 3
            }}
          >
            <Tab.Item
              title="数据库"
              titleStyle={{ fontSize: 11, color: 'rgb(48, 49, 51)' }}
            />
            <Tab.Item
              title="API"
              titleStyle={{ fontSize: 11, color: 'rgb(48, 49, 51)' }}
            />
          </Tab>
          <TabView
            value={tabIndex}
            onChange={setTabIndex}
            animationType="spring"
            containerStyle={{
              borderTopWidth: 1,
              borderColor: 'rgb(242, 242, 242)'
            }}
            disableSwipe={true}
          >
            <TabView.Item
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              {searchData.dbData.length == 0 ? (
                <View style={styles.emptyText}>
                  <Text style={{ color: 'grey', fontSize: 14 }}>
                    暂时没数据了...
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={searchData.dbData}
                  keyExtractor={(item) => item._id}
                  onEndReachedThreshold={0.2}
                  contentContainerStyle={{ paddingBottom: 5 }}
                  renderItem={({ item }) => <RenderDBItem item={item} />}
                  initialNumToRender={100} // 初始渲染数量item
                  windowSize={6} // 窗口大小（上下两个窗口）win
                  maxToRenderPerBatch={50} // 最大渲染数量item
                  ListFooterComponent={ListFooter}
                />
              )}
            </TabView.Item>
            <TabView.Item
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              {searchData.apiData.length == 0 ? (
                <View style={styles.emptyText}>
                  <Text style={{ color: 'grey', fontSize: 14 }}>
                    暂时没数据了...
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={searchData.apiData}
                  keyExtractor={(item) => item.id}
                  onEndReachedThreshold={0.2}
                  contentContainerStyle={{ paddingBottom: 5 }}
                  renderItem={({ item }) => <RenderApiItem item={item} />}
                  initialNumToRender={100} // 初始渲染数量item
                  windowSize={6} // 窗口大小（上下两个窗口）win
                  maxToRenderPerBatch={50} // 最大渲染数量item
                  ListFooterComponent={ListFooter}
                />
              )}
            </TabView.Item>
          </TabView>
        </View>
      )
    }
    return content
  }, [noneSearching, loading, tabIndex, searchData])

  return (
    <View style={styles.box}>
      <MyToast visible={showToast} text={toastText}></MyToast>
      <View
        style={styles.overlay}
        onBackdropPress={toggleOverlay}
      >
        <View style={styles.searchBar}>
          <Icon
            name="arrow-left"
            type="feather" // 图标库类型，如 feather、font-awesome、material 等
            color="grey"
            size={20}
            style={{ marginRight: 5 }}
            onPress={() => navigation.goBack()}
          />
          <SearchBar
            value={searchValue}
            onChangeText={handleSearchInputChange}
            containerStyle={styles.searchContainer}
            inputContainerStyle={{ backgroundColor: '#f5f7fa', height: 30 }}
            inputStyle={{
              backgroundColor: '#f5f7fa',
              color: '#000',
              fontSize: 11
            }}
          />
        </View>
        {Content}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    // overflow: 'hidden'
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: 5,
  },
  searchBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fcfcfcff',
  },
  searchContainer: {
    flex: 4,
    width: 100,
    backgroundColor: '#fff',
    borderColor: '#dcdfe6',
    borderTopColor: '#dcdfe6',
    borderBottomColor: '#dcdfe6',
    borderWidth: 1,
    borderRadius: 6
    // height: 40
  },
  emptyText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 50,
    width: '100%'
  },
  footer: {
    width: '100%',
    height: 10,
    backgroundColor: '#fff',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  line: {
    width: '40%',
    height: 1,
    backgroundColor: 'rgb(234, 234, 234)'
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: 'rgb(234, 234, 234)',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5
  }
})
