import React, { useEffect, useRef } from 'react'
import { setTaskId } from '../store/task'
import { setDialogVisible } from '../store/dialog'
import { useDispatch } from 'react-redux'

export default function useTaskSocket(taskId) {
  const ws = useRef(null)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('taskId', taskId)
    if (!taskId) return
    // 建立连接
    ws.current = new WebSocket('ws://192.168.1.5:3000/ws')

    // 连接成功
    ws.current.onopen = () => {
      console.log('WebSocket 连接成功')
      ws.current.send(JSON.stringify({ message: 'Hello WebSocket!', taskId }))
    }

    // 接收消息
    ws.current.onmessage = (e) => {
      console.log('收到消息:', e.data)
      const res = JSON.parse(e.data)
      console.log('ress', res)
      if (res.status == 'finished') {
        dispatch(setTaskId(''))
        dispatch(setDialogVisible(true))
        ws.current.close('close')
      }
    }

    // 连接关闭
    ws.current.onclose = (e) => {
      console.log('WebSocket 关闭:', e.code, e.reason)
    }

    // 错误处理
    ws.current.onerror = (e) => {
      console.error('WebSocket 出错:', e.message)
    }

    // 卸载时关闭连接
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [taskId])
}
