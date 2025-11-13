---
title: React Hooks 最佳实践
date: 2024-01-15
tags: [React, JavaScript, 前端]
excerpt: 深入探讨 React Hooks 的使用技巧和最佳实践。
---

# React Hooks 最佳实践

React Hooks 改变了我们编写 React 组件的方式。在这篇文章中，我将分享一些使用 Hooks 的最佳实践。

## 1. useState 使用技巧

### 基础用法

```javascript
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  )
}
```

### 函数式更新

当新的 state 依赖于旧的 state 时，使用函数式更新：

```javascript
// ❌ 不推荐
setCount(count + 1)

// ✅ 推荐
setCount(prevCount => prevCount + 1)
```

## 2. useEffect 使用技巧

### 清理副作用

```javascript
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Timer tick')
  }, 1000)
  
  // 清理函数
  return () => {
    clearInterval(timer)
  }
}, [])
```

### 依赖数组

```javascript
// ❌ 不推荐 - 缺少依赖
useEffect(() => {
  fetchData(userId)
}, [])

// ✅ 推荐 - 包含所有依赖
useEffect(() => {
  fetchData(userId)
}, [userId])
```

## 3. 自定义 Hooks

创建可复用的逻辑：

```javascript
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })
  
  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }
  
  return [storedValue, setValue]
}
```

## 4. useCallback 和 useMemo

### useCallback 优化函数

```javascript
const handleClick = useCallback(() => {
  console.log('Button clicked')
}, [])
```

### useMemo 优化计算

```javascript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

## 5. 常见陷阱

### 陷阱 1: 闭包陷阱

```javascript
// ❌ 问题代码
function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1) // 这里的count永远是0
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  return <div>{count}</div>
}

// ✅ 解决方案
function Counter() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1) // 使用函数式更新
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  return <div>{count}</div>
}
```

### 陷阱 2: 过度使用 useEffect

```javascript
// ❌ 不推荐
function SearchResults({ query }) {
  const [results, setResults] = useState([])
  
  useEffect(() => {
    const filtered = items.filter(item => 
      item.name.includes(query)
    )
    setResults(filtered)
  }, [query])
  
  return <div>{results.map(...)}</div>
}

// ✅ 推荐 - 直接计算
function SearchResults({ query }) {
  const results = items.filter(item => 
    item.name.includes(query)
  )
  
  return <div>{results.map(...)}</div>
}
```

## 总结

React Hooks 为函数组件带来了强大的能力：

1. **useState** - 简单的状态管理
2. **useEffect** - 处理副作用
3. **useCallback/useMemo** - 性能优化
4. **自定义 Hooks** - 逻辑复用

> **提示**: 遵循 Hooks 规则，只在顶层调用 Hooks，不要在循环、条件或嵌套函数中调用。

掌握这些最佳实践，能让你的 React 代码更加简洁、高效和易于维护！

