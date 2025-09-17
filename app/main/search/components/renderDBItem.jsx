import { useRouter } from 'expo-router'
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { BASE_URL } from '../../../../config'

export default function RenderDBItem({ item }) {
  const router = useRouter()

  const goToDetail = (_id) => {
    router.push({
      pathname: "/main/detail",
      params: { _id },
    })
  }

  return (
    <TouchableWithoutFeedback onPress={() => goToDetail(item._id)}>
      <View style={styles.dbItemContainer}>
        <View style={styles.dbItemHeader}>
          <Image
            style={styles.dbItemIcon}
            source={{ uri: `${BASE_URL}/inflow${item.iconLink}` }}
            resizeMode="contain"
          />
          <Text style={styles.dbItemTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        {/* <Text style={{fontSize: 11}}>作者：{item.author} ·</Text> */}
        <View style={styles.dbItemSummaryContainer}>
          <Text style={styles.dbItemSummary} numberOfLines={2}>
            {item.summary}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  dbItemContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRadius: 3,
    borderColor: '#dcdfe6',
    padding: 10,
    backgroundColor: '#ffffff',
    marginTop: 5,
    marginRight: 3,
    marginLeft: 3,
    elevation: 1
  },
  dbItemHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12
  },
  dbItemIcon: {
    width: 14,
    height: 14
    // marginTop: 5
  },
  dbItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    overflow: 'hidden',
    marginLeft: 5,
    fontSize: 13,
    marginBottom: 5
  },
  dbItemSummaryContainer: {
    overflow: 'hidden'
  },
  dbItemSummary: {
    overflow: 'hidden',
    fontSize: 11,
    lineHeight: 15
  }
})
