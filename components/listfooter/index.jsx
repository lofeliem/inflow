import { View, Text, StyleSheet } from 'react-native'

export default function ListFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.line}></View>
      <View style={styles.dot}></View>
      <View style={styles.line}></View>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: 35,
    backgroundColor: '#fff',
    // marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  line: {
    width: '30%',
    height: 1,
    backgroundColor: 'rgb(242, 242, 242)'
  },
  dot: {
    width: 3,
    height: 3,
    backgroundColor: 'rgb(242, 242, 242)',
    borderRadius: 10,
    marginLeft: 5,
    marginRight: 5
  }
})
