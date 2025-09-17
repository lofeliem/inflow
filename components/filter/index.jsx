import React, { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { BASE_URL } from '../../config'

import { Button, Icon, ListItem } from '@rneui/themed'
import Toast from 'react-native-root-toast'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSourcesList,
  setCurrentDrawerType,
  setfilterSourcesIds,
  setisSelectAll,
  setSourcesList
} from '../../store/drawer'



export default function SourcesFilter({navigation}) {
  const sourcesList = useSelector((state) => state.drawer.sourcesList)
  const [isEdit, setIsEdit] = useState(false)
  const isSelectAll = useRef(false)
  const dispatch = useDispatch()
  navigation = navigation.navigation


  useEffect(() => {
    dispatch(fetchSourcesList())
    isSelectAll.current = true
  }, [dispatch])

  const handleSourcesList = () => {
    let arr = []
    for (const item of sourcesList) {
      item.checked = true
      arr.push(item)
    }
    dispatch(setSourcesList(arr))
  }

  const handleToggleAll = () => {
    isSelectAll.current = !isSelectAll.current
    let arr = JSON.parse(JSON.stringify(sourcesList))
    arr = arr.map((item) => ({
      ...item,
      checked: isSelectAll.current
    }))
    dispatch(setSourcesList(arr))
  }

  const handleCheckbox = (id) => {
    let arr = JSON.parse(JSON.stringify(sourcesList))
    arr = arr.map((item) => {
      if (item._id === id) {
        isSelectAll.current = false
        return { ...item, checked: !item.checked }
      }
      return item
    })
    dispatch(setSourcesList(arr))
  }

  const handleComfirm = () => {
    let selectedSourcesIds = sourcesList.map((item) => {
      if (item.checked === true) return item._id
    })
    selectedSourcesIds = selectedSourcesIds.filter((item) => item !== undefined)
    console.log('selectedSourcesIds', selectedSourcesIds)
    dispatch(setfilterSourcesIds(selectedSourcesIds))
    dispatch(setisSelectAll(isSelectAll.current))
    dispatch(setCurrentDrawerType(0))
    navigation.closeDrawer()
  }

  const handleEdit = () => {
    const value = isEdit
    setIsEdit(!value)
  }

  const handleDeleteSource = (item) => {
    fetch(`${BASE_URL}/inflow/deletesource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id: item._id
      })
    })
      .then((res) => res.json())
      .then((res) => {
        Toast.show('删除source成功', {
          duration: Toast.durations.SHORT,
          position: 80,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'black'
        })
        let arr = sourcesList
        arr = arr.filter((it) => it._id !== item._id)
        dispatch(setSourcesList(arr))
        setIsEdit(false)
      })
      .catch((err) => {
        Toast.show(`删除source失败：${err}`, {
          duration: Toast.durations.SHORT,
          position: 80,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: 'red'
        })
      })
  }

  const ListCheckBox = ({ item }) => {
    const checkboxItem = sourcesList.find(
      (listItem) => listItem._id === item._id
    )

    const deletedCheckboxItem = sourcesList.find(
      (listItem) => listItem._id === item._id
    )
    const isChecked = checkboxItem ? checkboxItem.checked : false
    const isDeletedChecked = checkboxItem ? checkboxItem.deletedChecked : false
    return (
      <>
        {isEdit ? (
          <TouchableWithoutFeedback onPress={() => handleDeleteSource(item)}>
            <Icon
              name="delete"
              type="material-design-icons"
              color="rgb(241, 94, 94)"
              size={20}
            />
          </TouchableWithoutFeedback>
        ) : (
          <ListItem.CheckBox
            checked={isChecked}
            size={18}
            checkedColor={'rgb(102, 177, 255)'}
            uncheckedColor="rgb(233, 233, 235)"
            onPress={() => handleCheckbox(item._id)}
          />
        )}
      </>
    )
  }

  const RenderItem = ({ item, index }) => {
    const curIndex = index + 1

    return (
      <ListItem
        containerStyle={
          curIndex == sourcesList.length ? style.lastListItem : style.listItem
        }
        onPress={() => handleCheckbox(item._id)}
        key={item._id}
      >
        {ListCheckBox({ item })}
        <ListItem.Content style={style.renderBox}>
          <Image
            style={style.renderImage}
            source={{
              uri: item.iconLink ? (`${
                item.iconLink.startsWith('/icons')
                  ? `${BASE_URL}/inflow${item.iconLink}`
                  : item.iconLink
              }`) : ''
            }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 11 }}>{item.title}</Text>
        </ListItem.Content>
      </ListItem>
    )
  }

  return (
    <View style={style.box}>
      <View style={style.title}>
        <Text style={{ fontSize: 11 }}>消息源选择</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Button
            buttonStyle={{
              padding: 5,
              borderColor: 'rgb(153, 161, 168)'
            }}
            type="outline"
            titleStyle={{ color: 'rgb(101, 107, 112)', fontSize: 11 }}
            containerStyle={{
              width: 50,
              marginRight: 10
            }}
            title="编辑"
            onPress={() => handleEdit()}
          />
          <Button
            buttonStyle={{
              padding: 5,
              borderColor: 'rgba(78, 116, 289, 1)'
            }}
            type="outline"
            titleStyle={{ color: 'rgba(78, 116, 289, 1)', fontSize: 11 }}
            containerStyle={{
              width: 50
            }}
            title="筛选"
            onPress={() => handleComfirm()}
          />
        </View>
      </View>
      <ListItem containerStyle={style.listItemAll}>
        <ListItem.CheckBox
          size={18}
          checkedColor="rgb(102, 177, 255)"
          uncheckedColor="rgb(233, 233, 235)"
          checked={isSelectAll.current}
          onPress={() => handleToggleAll()}
        />
        <ListItem.Content style={style.renderBox}>
          <Text style={{ fontSize: 11 }}>全选</Text>
        </ListItem.Content>
      </ListItem>
      <FlatList
        style={style.sourcesList}
        data={sourcesList}
        keyExtractor={(item) => item._id}
        renderItem={RenderItem}
      />
    </View>
  )
}

const style = StyleSheet.create({
  box: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#dcdfe6',
    height: '80%'
  },
  renderBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 20,
    marginBottom: 5
  },
  renderImage: {
    width: 18,
    height: 18,
    marginTop: 3,
    marginRight: 10
  },
  listItem: {
    borderColor: '#ebedf0',
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    padding: 5
  },
  lastListItem: {
    borderBottomWidth: 0,
    borderColor: '#ebedf0',
    borderBottomWidth: 1,
    backgroundColor: '#ffffff',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    padding: 5
  },
  listItemAll: {
    borderColor: '#ebedf0',
    borderBottomWidth: 2,
    backgroundColor: '#ffffff',
    // height: 40,
    padding: 5,
    marginLeft: 10,
    marginRight: 10
  },
  sourcesList: {
    height: '80%'
  },
  title: {
    borderWidth: 1,
    borderTopWidth: 0,
    padding: 10,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: '#dadde1',
    backgroundColor: '#f5f6f7',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 10
  }
})
