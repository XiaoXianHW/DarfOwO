// 统计字数（中英文混合）
export const countWords = (text) => {
  if (!text) return 0
  
  // 移除markdown语法标记
  let cleanText = text
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 保留链接文本
    .replace(/[#*_~`>]/g, '') // 移除markdown标记
    .replace(/\n+/g, ' ') // 将换行转为空格
  
  // 统计中文字符
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || []
  
  // 统计英文单词
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, ' ') // 将中文替换为空格
    .match(/[a-zA-Z0-9]+/g) || []
  
  return chineseChars.length + englishWords.length
}

// 估算阅读时间（分钟）
export const estimateReadingTime = (wordCount) => {
  // 中文阅读速度约 300-500 字/分钟，英文约 200-300 词/分钟
  // 这里取平均值 400 字/分钟
  const minutes = Math.ceil(wordCount / 400)
  return minutes < 1 ? 1 : minutes
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

