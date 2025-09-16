const timeAgo = (dateString) => {
  const now = new Date()
  const past = new Date(dateString)
  const diffMs = now - past

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const months = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))
  const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365))

  if (years > 0) {
    if (years < 6) return `${years} 年前`
    else return '若干年前'
  }
  if (months > 0) return `${months} 月前`
  if (days > 0) return `${days} 天前`
  if (hours > 0) return `${hours} 小时前`
  if (minutes > 0) return `${minutes} 分钟前`
  return `${seconds} 秒前`
}

export {
  timeAgo
}
