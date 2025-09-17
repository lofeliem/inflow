import { Button } from '@rneui/base'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import Toast from 'react-native-root-toast'
import { useDispatch } from 'react-redux'
import { BASE_URL } from '../../../../config'
import { fetchSourcesList } from '../../../../store/drawer'
import { updateApiList } from '../../../../store/search'
import { timeAgo } from '../../../../utils'

const defaultBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAQlBMVEX///8rskzK7NJFvGI4t1fj9ehgxXmv47yV2KaV2aXl9uny+vSI1Jp7zo+958d7z4+i3bBSwW7y+/Si3bHY8d5uyoRTh8daAAAB+klEQVRo3u3Y23K0IAwA4BDkICoe9/1f9R/sWOavuGWmIb1ovpvO2N0NkEhQEEIIIYQQQgghRAU/TZP3Dg/g5dSn9bUjsJnV/6wLwOLo1FcrT+wBEaPzk+1UNiMwGtBbddEOeOGsc2hmcb6SHYCZGbU6jfyh+4/QGoGb6dXJAzszf0w6ADunz8gHsDNWJTvw63OimcXutyIb/Vcjc1dYjoxAK9RG7gJp2PMn7cvj9jZyqu0VCI2Vx614NiviDSKz8fmDxGkeZrtqpSqOPDb9dwNaA+6v7god3qR5hAZwVm9b8FJYbOpzR3hcbAs3lOeOLj4uNkIjxj4vd1++mdu34CFPuYnjsSn0DbOcm0LknnJuCsxTzk1hu085LcUGDeFDU7C0h5H6fQqJ17p+n0o5CNBQ3qfuDXwBavcK5l/rfNPer3ZUdY2734/aKVuyPQRzLyxMeSsNZ6E9dbnS27ellOSJ9p2iwppCGtLqEAQ+d+XezV0pyLXWt2/Aj8U0fnPdtl8r7HUuQ+FiIDnQu8edYUnXSpmPJG9v8TPZvqaQfBor4Yx9YXbmdsjKIyQo6nW7nt6wUF269JWRZl/UDned/hZrvtGNvKjsnrmVOHD5QdWXm3JoFBh6nZ8eCqPSpew4oGDcOI1xKJZAP5n756cehBBCCCGEEEII8b1/UIkNT8SQ2JgAAAAASUVORK5CYII='

export default function RenderApiItem({ item }) {
  const dispatch = useDispatch()

  const getOrigin = (url) => {
    if (!url) return ''
    const match = url.match(/^https?:\/\/[^/]+/)
    const origin = match ? match[0].replace(/^https?:\/\//, '') : ''
    return origin
  }

  const handleFollow = () => {
    fetch(`${BASE_URL}/inflow/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        feed: item,
        action: item.isFollow == true ? '0' : '1'
      })
    })
      .then((res) => res.json())
      .then((res) => {
        showToast(`${item.isFollow ? '取消follow成功' : 'follow成功'}`)
        dispatch(
          updateApiList({
            feedId: item.feedId,
            key: 'isFollow',
            change: item.isFollow ? false : true
          })
        )
        dispatch(fetchSourcesList())
      })
      .catch((err) => {
        console.log(err)
        showToast(`关注失败，${err}`)
      })
  }

  const showToast = (text) => {
    Toast.show(text, {
      duration: Toast.durations.SHORT,
      position: 80,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: 'black'
    })
  }

  return (
    <TouchableWithoutFeedback>
      <View style={styles.dbItemContainer}>
        <View style={styles.dbItemHeader}>
          <View style={styles.dbItemHeaderFront}>
            <Image
              style={styles.dbItemIcon}
              source={{
                uri: item.iconUrl ? item.iconUrl : defaultBase64
              }}
              resizeMode="contain"
            />
            <Text style={styles.dbItemTitle} numberOfLines={1}>
              {item.title}
            </Text>
          </View>

          <Button
            title={item.isFollow ? 'unFollow' : 'Follow'}
            type="outline"
            buttonStyle={{ width: 80, height: 30 }}
            titleStyle={[
              item.isFollow
                ? { color: 'rgb(188, 188, 188)' }
                : { color: 'rgb(32, 137, 220)' },
              { fontSize: 10 }
            ]}
            TouchableComponent={TouchableOpacity}
            onPress={() => handleFollow()}
          />
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Text
            style={{
              fontSize: 11,
              marginBottom: 3,
              color: 'rgb(144, 147, 153)'
            }}
          >
            {getOrigin(item.website)}
          </Text>
          <Text
            style={{
              fontSize: 10,
              marginBottom: 3,
              marginLeft: 40,
              color: 'rgb(144, 147, 153)'
            }}
          >
            上次更新: {timeAgo(item.lastUpdated)}
          </Text>
        </View>
        <View style={styles.dbItemSummaryContainer}>
          <Text style={styles.dbItemSummary} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  dbItemContainer: {
    // minHeight: 100,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRadius: 3,
    borderColor: '#dcdfe6',
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: 'rgb(255, 255, 255)',
    marginTop: 5,
    marginRight: 3,
    marginLeft: 3,
    elevation: 1,
    fontSize: 10
  },
  dbItemHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  dbItemHeaderFront: {
    // width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
    fontSize: 13,
    maxWidth: 220
  },
  dbItemIcon: {
    width: 14,
    height: 14
    // marginTop: 5
  },
  dbItemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    overflow: 'hidden',
    marginLeft: 10
  },
  dbItemSummaryContainer: {
    overflow: 'hidden'
  },
  dbItemSummary: {
    overflow: 'hidden',
    fontSize: 11
  }
})
