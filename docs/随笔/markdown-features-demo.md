---
title: Markdown 功能演示
date: 2024-02-20
tags: [Markdown, 功能展示, 样式]
excerpt: 展示本博客支持的各种 Markdown 功能和样式。
---

这篇文章展示了本博客支持的所有 Markdown 功能和样式。

## 代码块示例

### JavaScript 代码

```javascript
// 这是一个 JavaScript 示例
const greeting = (name) => {
  console.log(`Hello, ${name}!`)
  return `Welcome to my blog`
}

// 调用函数
const message = greeting('World')
console.log(message)
```

### Python 代码

```python
# Python 示例代码
def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 计算前10个斐波那契数
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
```

### TypeScript 代码

```typescript
interface User {
  id: number
  name: string
  email: string
}

class UserManager {
  private users: User[] = []
  
  addUser(user: User): void {
    this.users.push(user)
  }
  
  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id)
  }
}

const manager = new UserManager()
manager.addUser({ id: 1, name: 'Alice', email: 'alice@example.com' })
```

## 引用块样式

### 提示信息

> **提示**: 这是一个提示类型的引用块，用于提供有用的信息和建议。
> 
> 你可以使用这种样式来突出显示重要的提示内容。

### 注意事项

> **注意**: 这是一个警告类型的引用块，用于提醒用户注意某些事项。
> 
> 请仔细阅读这些注意事项，避免潜在的问题。

### 警告信息

> **警告**: 这是一个危险类型的引用块，用于标识可能造成严重后果的操作。
> 
> 请务必在执行前三思！

### 信息说明

> **记住**: 这是一个信息类型的引用块，用于强调需要记住的关键信息。
> 
> 这些内容对理解主题非常重要。

### 普通引用

> 这是一个普通的引用块，用于引用他人的话语或重要的段落。
> 
> 它使用标准的引用样式，适合大多数情况。

## 内联代码

你可以在文字中使用 `内联代码` 来高亮显示代码片段，比如 `console.log()` 或 `useState()` 这样的函数名。

## 表格示例

| 语言 | 类型 | 用途 | 难度 |
|------|------|------|------|
| JavaScript | 动态 | Web开发 | ⭐⭐ |
| Python | 动态 | 数据科学 | ⭐⭐ |
| TypeScript | 静态 | 大型应用 | ⭐⭐⭐ |
| Rust | 静态 | 系统编程 | ⭐⭐⭐⭐ |
| Go | 静态 | 后端服务 | ⭐⭐⭐ |

## 列表示例

### 无序列表

- 第一项
  - 子项 1.1
  - 子项 1.2
- 第二项
- 第三项

### 有序列表

1. 首先，准备开发环境
2. 然后，创建项目结构
3. 接着，编写核心代码
4. 最后，进行测试和部署

### 任务列表

- [x] 完成项目初始化
- [x] 实现基础功能
- [x] 添加代码高亮
- [ ] 添加评论系统
- [ ] 集成搜索功能
- [ ] 性能优化

## 文本样式

- **粗体文本**
- *斜体文本*
- ***粗斜体文本***
- ~~删除线文本~~
- `代码文本`

## 链接示例

- 外部链接：[GitHub](https://github.com)
- 内部链接：[返回首页](/)
- 邮箱链接：[联系我](mailto:example@example.com)

## 分隔线

---

## 组合示例

下面是一个综合示例，展示如何在实际文章中使用这些元素：

> **提示**: 在开始编写React应用之前，确保你已经安装了Node.js。

首先，创建一个新的React应用：

```bash
npx create-react-app my-app
cd my-app
npm start
```

然后，你可以在 `src/App.js` 中编写你的组件：

```jsx
import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div className="App">
      <h1>计数器: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  )
}

export default App
```

> **注意**: 不要忘记在生产环境中优化你的应用！

## 总结

本文展示了博客支持的所有主要 Markdown 功能：

| 功能 | 状态 |
|------|------|
| 代码高亮 | ✅ |
| 复制按钮 | ✅ |
| 引用块 | ✅ |
| 表格 | ✅ |
| 任务列表 | ✅ |
| 明暗主题 | ✅ |

希望这些功能能够帮助你更好地展示内容！🎉

