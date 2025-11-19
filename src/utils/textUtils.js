// 统计字数（中英文混合）
export const countWords = (text) => {
  if (!text) return 0
  
  let cleanText = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[#*_~`>]/g, '')
    .replace(/\n+/g, ' ')
  
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || []
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .match(/[a-zA-Z0-9]+/g) || []
  
  return chineseChars.length + englishWords.length
}

// 格式化字数显示
export const formatWordCount = (count) => {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万字`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k字`
  }
  return `${count}字`
}
