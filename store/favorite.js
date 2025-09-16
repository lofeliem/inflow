import { createSlice } from '@reduxjs/toolkit'

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    currentFavoriteId: ''
  },
  reducers: {
    setCurrentFavoriteId(state, action) {
      state.currentFavoriteId = action.payload
    }
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { setCurrentFavoriteId } = favoriteSlice.actions

export default favoriteSlice.reducer
