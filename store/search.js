import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../config'

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    toggleSearch: false,
    searchData: { dbData: [], apiData: [] }
  },
  reducers: {
    setToggleSearch(state, action) {
      state.toggleSearch = action.payload
    },
    setSearchData(state, action) {
      state.searchData = action.payload
    },
    updateApiList(state, action) {
      const { feedId, key, change } = action.payload
      const item = state.searchData.apiData.find((i) => i.feedId === feedId);
      item[key] = change
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearch.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSearch.fulfilled, (state, action) => {
        state.loading = false
        state.searchData = action.payload || { dbData: [], apiData: [] }
      })
      .addCase(fetchSearch.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const fetchSearch = createAsyncThunk(
  'search/fetchSearch',
  async (searchValue) => {
    const res = await fetch(
      `${BASE_URL}/inflow/search/${searchValue.current}?query=${searchValue.current}`,
      {
        method: 'GET'
      }
    )
    let result = await res.json()
    result = result.data
    return result
  }
)

// 每个 case reducer 函数会生成对应的 Action creators
export const {
  setToggleSearch,
  setApiList,
  setDBList,
  setSearchData,
  updateApiList
} = searchSlice.actions

export default searchSlice.reducer
