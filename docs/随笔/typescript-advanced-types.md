---
title: TypeScript 高级类型实战
date: 2024-02-01
tags: [TypeScript, JavaScript, 类型系统]
excerpt: 深入了解 TypeScript 的高级类型系统和实用技巧。
---

# TypeScript 高级类型实战

TypeScript 的类型系统非常强大，掌握高级类型能够让你写出更安全、更优雅的代码。

## 1. 联合类型和交叉类型

### 联合类型 (Union Types)

```typescript
type Status = 'pending' | 'success' | 'error'

interface SuccessResponse {
  status: 'success'
  data: any
}

interface ErrorResponse {
  status: 'error'
  message: string
}

type ApiResponse = SuccessResponse | ErrorResponse
```

### 交叉类型 (Intersection Types)

```typescript
interface Colorful {
  color: string
}

interface Circle {
  radius: number
}

type ColorfulCircle = Colorful & Circle

const cc: ColorfulCircle = {
  color: 'red',
  radius: 42
}
```

## 2. 泛型约束

```typescript
// 基础泛型
function identity<T>(arg: T): T {
  return arg
}

// 泛型约束
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}
```

## 3. 映射类型

### Readonly & Partial

```typescript
interface User {
  id: number
  name: string
  email: string
}

// 所有属性只读
type ReadonlyUser = Readonly<User>

// 所有属性可选
type PartialUser = Partial<User>

// 所有属性必填
type RequiredUser = Required<PartialUser>
```

### 自定义映射类型

```typescript
type Nullable<T> = {
  [P in keyof T]: T[P] | null
}

type NullableUser = Nullable<User>
// {
//   id: number | null
//   name: string | null
//   email: string | null
// }
```

## 4. 条件类型

```typescript
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false

// 实用示例：提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getUser() {
  return { name: 'John', age: 30 }
}

type User = ReturnType<typeof getUser>
// { name: string; age: number }
```

## 5. infer 关键字

```typescript
// 提取数组元素类型
type ArrayElement<T> = T extends (infer E)[] ? E : never

type StringArray = ArrayElement<string[]>  // string
type NumberArray = ArrayElement<number[]>  // number

// 提取 Promise 返回类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

type Result = UnwrapPromise<Promise<string>>  // string
```

## 6. 模板字面量类型

```typescript
type EventName = 'click' | 'scroll' | 'mousemove'
type EventHandler = `on${Capitalize<EventName>}`
// 'onClick' | 'onScroll' | 'onMousemove'

// 实用示例：API 路径
type HttpMethod = 'get' | 'post' | 'put' | 'delete'
type ApiPath = `/api/${string}`
type ApiEndpoint = `${HttpMethod} ${ApiPath}`

const endpoint: ApiEndpoint = 'get /api/users'
```

## 7. 实战示例：类型安全的 Redux

```typescript
// Action 类型定义
interface Action<T extends string, P = undefined> {
  type: T
  payload: P
}

// Action Creator
function createAction<T extends string, P = undefined>(
  type: T
): (payload: P) => Action<T, P> {
  return (payload: P) => ({ type, payload })
}

// 使用
const increment = createAction<'INCREMENT', number>('INCREMENT')
const setUser = createAction<'SET_USER', { name: string }>('SET_USER')

const action1 = increment(5)  // { type: 'INCREMENT', payload: 5 }
const action2 = setUser({ name: 'John' })  // 类型安全！
```

## 8. 工具类型实战

```typescript
// Pick - 选择部分属性
type UserPreview = Pick<User, 'id' | 'name'>

// Omit - 排除部分属性
type UserWithoutEmail = Omit<User, 'email'>

// Record - 构造对象类型
type PageConfig = Record<string, { title: string; path: string }>

const pages: PageConfig = {
  home: { title: 'Home', path: '/' },
  about: { title: 'About', path: '/about' }
}

// Extract - 提取联合类型
type T1 = Extract<'a' | 'b' | 'c', 'a' | 'f'>  // 'a'

// Exclude - 排除联合类型
type T2 = Exclude<'a' | 'b' | 'c', 'a' | 'f'>  // 'b' | 'c'
```

## 最佳实践

### 1. 使用严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 2. 避免 any

```typescript
// ❌ 不推荐
function process(data: any) {
  return data.value
}

// ✅ 推荐
function process<T extends { value: unknown }>(data: T) {
  return data.value
}
```

### 3. 使用类型守卫

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function process(value: unknown) {
  if (isString(value)) {
    // 这里 value 类型为 string
    console.log(value.toUpperCase())
  }
}
```

## 总结

TypeScript 的高级类型系统提供了：

- 🔒 **类型安全** - 在编译时捕获错误
- 🎯 **精确推断** - 智能的类型推断
- 🔄 **代码复用** - 通过泛型和映射类型
- 📝 **自文档化** - 类型即文档

> **注意**: 不要过度使用高级类型，保持代码的可读性和可维护性。

掌握这些高级类型技巧，能让你的 TypeScript 代码更加健壮和优雅！

