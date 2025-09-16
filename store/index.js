import { configureStore } from '@reduxjs/toolkit'
import drawerReducer from './drawer'
import favoriteReducer from './favorite'
import searchReducer from './search'
import detailReducer from './detail'
import taskReducer from './task'
import dialogReducer from './dialog'

export default configureStore({
  reducer: {
    drawer: drawerReducer,
    favorite: favoriteReducer,
    search: searchReducer,
    detail: detailReducer,
    task: taskReducer,
    dialog: dialogReducer
  }
})
