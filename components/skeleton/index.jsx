import { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { Skeleton } from '@rneui/base'

export default function MySkeleton({ group }) {
  const [groupCount, setGroupCount] = useState([])

  useEffect(() => {
    const arr = new Array(group).fill({})
    console.log('rr', arr)
    setGroupCount(arr)
  }, [])
  return (
    <View style={{ marginBottom: 30, padding: 20 }}>
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

      {groupCount.map((item, idx) => (
        <View key={idx}>
          <View style={{ marginTop: 30, marginLeft: 20 }}>
            <Skeleton animation="wave" width={'100%'} height={15} />
          </View>
          <View style={{ marginTop: 15 }}>
            <Skeleton animation="wave" width={'100%'} height={15} />
          </View>
          <View style={{ marginTop: 15 }}>
            <Skeleton animation="wave" width={'80%'} height={15} />
          </View>
        </View>
      ))}

      {/* <View style={{ marginTop: 30, marginLeft: 20 }}>
        <Skeleton animation="wave" width={'100%'} height={15} />
      </View>
      <View style={{ marginTop: 15 }}>
        <Skeleton animation="wave" width={'100%'} height={15} />
      </View>
      <View style={{ marginTop: 15 }}>
        <Skeleton animation="wave" width={'80%'} height={15} />
      </View> */}
    </View>
  )
}
