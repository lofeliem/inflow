import { createSlice } from '@reduxjs/toolkit'

export const detailSlice = createSlice({
  name: 'detail',
  initialState: {
    detailInfo: {}
  },
  reducers: {
    setDetailInfo(state, action) {
      state.detailInfo = action.payload
    }
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { setDetailInfo } = detailSlice.actions

export default detailSlice.reducer
