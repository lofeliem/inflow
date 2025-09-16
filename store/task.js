import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { BASE_URL } from '../config'

export const taskSlice = createSlice({
  name: 'task',
  initialState: {
    taskId: '',
    updateData: false
  },
  reducers: {
    setTaskId(state, action) {
      state.taskId = action.payload
    },
    setUpdateData(state, action) {
      state.updateData = action.payload
    }
  },
  extraReducers: (builder) => {
      builder
        .addCase(fetchTaskId.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchTaskId.fulfilled, (state, action) => {
          state.loading = false
          state.taskId = action.payload || { dbData: [], apiData: [] }
        })
        .addCase(fetchTaskId.rejected, (state, action) => {
          state.loading = false
          state.error = action.error.message
        })
    }
})

export const fetchTaskId = createAsyncThunk(
  'task/fetchTaskId',
  async () => {
    const res = await fetch(`${BASE_URL}/inflow/updatedata`,{
      method: 'POST'
    })
    let result = await res.json()
    console.log('updatedatat', result)
    result = result.data
    return result
  }
)

// 每个 case reducer 函数会生成对应的 Action creators
export const { setTaskId, setUpdateData } = taskSlice.actions

export default taskSlice.reducer
