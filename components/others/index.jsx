import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native'
import { BASE_URL } from '../../config'

import { Icon, ListItem } from '@rneui/themed'
import { useDispatch } from 'react-redux'
import { setCurrentDrawerType } from '../../store/drawer'

export default function Others({navigation}) {
  const [sourcesList, setSourcesList] = useState([])
  const isSelectAll = useRef(false)
  const dispatch = useDispatch()
  navigation = navigation.navigation

  useEffect(() => {
    fetchSources()
  }, [])

  const fetchSources = () => {
    fetch(`${BASE_URL}/inflow/sourceslist`, {
      method: 'get'
    })
      .then((res) => res.json())
      .then((res) => {
        const arr = []
        for (const item of res.data) {
          item.checked = true
          isSelectAll.current = true
          arr.push(item)
        }
        setSourcesList(arr)
      })
  }

  const handleCheckFavorite = () => {
		dispatch(setCurrentDrawerType(1))
    // navigation.dispatch(DrawerActions.closeDrawer())
    navigation.closeDrawer()
  }

	const handleCheckReadLater = () => {
		dispatch(setCurrentDrawerType(2))
    // navigation.dispatch(DrawerActions.closeDrawer())
    navigation.closeDrawer()
  }

  return (
    <View style={style.box}>
      <TouchableHighlight
        underlayColor="rgb(247, 247, 247)"
        onPress={() => handleCheckFavorite()}
      >
        <ListItem containerStyle={style.listItemAll}>
          <ListItem.Content style={style.listItem}>
            <Icon
              name="star"
              type="ant-design" // 图标库类型，如 feather、font-awesome、material 等
              color="rgb(250, 173, 20)"
              size={18}
            />
            <Text style={style.listItemText}>收藏</Text>
          </ListItem.Content>
        </ListItem>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor="rgb(247, 247, 247)"
        onPress={() => handleCheckReadLater()}
      >
        <ListItem containerStyle={style.listItemAll}>
          <ListItem.Content style={style.listItem}>
            <Icon
              name="watch-later"
              type="material" // 图标库类型，如 feather、font-awesome、material 等
              color="rgb(180, 180, 180)"
              size={18}
            />
            <Text style={style.listItemText}>稍后再看</Text>
          </ListItem.Content>
        </ListItem>
      </TouchableHighlight>
    </View>
  )
}

const style = StyleSheet.create({
  box: {
    backgroundColor: '#ffffff',
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#dcdfe6',
    // height: '%'
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // marginBottom: 5
  },
  listItemText: {
    fontSize: 11,
    marginLeft: 5,
    lineHeight: 22
  },
  listItemAll: {
    borderColor: '#ebedf0',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    marginLeft: 10,
    marginRight: 10,
    height: 40, 
    padding: 5
  }
})
