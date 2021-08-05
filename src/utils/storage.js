/*
    本地存储封装模块
*/

export const getItem = name => {
  const data = localStorage.getItem(name)
  // 为避免 data 不是 JOSN 格式字符串，使用 try
  try {
    // 尝试把 data 转为 JavaScript 对象
    return JSON.parse(data)
  } catch (error) {
    // data 不是 JSON 格式，直接返回
    return data
  }
}

export const setItem = (name, value) => {
  // 如果 value 是对象，就存储为 JSON 格式的字符串
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(name, value)
}

export const removeItem = name => {
  localStorage.removeItem(name)
}
