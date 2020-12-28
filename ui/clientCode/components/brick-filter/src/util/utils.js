export function _deepClone(target) {
  let result

  if (typeof target === 'object') {
    if (Array.isArray(target)) {
      result = [] // 将result赋值为一个数组，并且执行遍历
      for (const i in target) {
        // 递归克隆数组中的每一项
        result.push(_deepClone(target[i]))
      }
    } else if (target === null) {
      result = null
    } else if (target.constructor === RegExp) {
      result = target
    } else {
      result = {}
      for (const i in target) {
        result[i] = _deepClone(target[i])
      }
    }
  } else {
    result = target
  }
  return result
}

export function toFormData(params) {
  const formData = new FormData()
  Object.keys(params).forEach(key => {
    formData.append(key, params[key])
  })
  return formData
}

export function toImitateFormData(params) {
  return new URLSearchParams(params).toString()
}

export function foundDiffIndex(a, b) {
  const arr1 = a.split('')
  const arr2 = b.split('')

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return i
    }
  }
  return undefined
}
