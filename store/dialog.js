import { createSlice } from '@reduxjs/toolkit'

export const dialogSlice = createSlice({
  name: 'dialog',
  initialState: {
    dialogVisible: false
  },
  reducers: {
    setDialogVisible(state, action) {
      state.dialogVisible = action.payload
    }
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { setDialogVisible } = dialogSlice.actions

export default dialogSlice.reducer
