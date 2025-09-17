import React from 'react';
import { StyleSheet, View } from 'react-native';
import SourcesFilter from '../components/filter';
import Others from '../components/others';

export default function DrawerScreen({navigation}) {
  // const navigation = useNavigation()
  return (
    <View style={style.box}>
      <SourcesFilter navigation={navigation}/>
      <Others navigation={navigation}/>
    </View>
  )
}

const style = StyleSheet.create({
  box: {
    flex: 1,
    paddingTop: 20,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 30,
    backgroundColor: 'rgb(237, 237, 237)'
  }
})
