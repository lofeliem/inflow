import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../config'

export const drawerSlice = createSlice({
  name: 'counter',
  initialState: {
    filterSourcesIds: [],
    isSelectAll: true,
    currentDrawerType: 0, // 0: sources, 1: favorite, 2: read later
    sourcesList: []
  },
  reducers: {
    setfilterSourcesIds(state, action) {
      state.filterSourcesIds = [...action.payload]
    },
    setisSelectAll(state, action) {
      state.isSelectAll = action.payload
    },
    setCurrentDrawerType(state, action) {
      state.currentDrawerType = action.payload
    },
    setSourcesList(state, action) {
      state.sourcesList = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSourcesList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSourcesList.fulfilled, (state, action) => {
        state.loading = false
        state.sourcesList = action.payload // 这里设置
      })
      .addCase(fetchSourcesList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const fetchSourcesList = createAsyncThunk(
  'drawer/fetchSourceslist',
  async () => {
    const res = await fetch(`${BASE_URL}/inflow/sourceslist`, {
      method: 'get'
    })
    let result = await res.json()
    result = result.data
    console.log('✅--sourcelist---', result)
    for (const item of result) {
      item.checked = true
    }
    return await result
  }
)

// 每个 case reducer 函数会生成对应的 Action creators
export const {
  setfilterSourcesIds,
  setisSelectAll,
  setCurrentDrawerType,
  setSourcesList
} = drawerSlice.actions

export default drawerSlice.reducer
