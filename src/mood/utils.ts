export function typeConvector(content: any, type: any) {
  switch (type) {
    case Boolean:
      return toBoolean(content)
    case Number:
      return toNumber(content)
    case String:
      return toString(content)
    case Date:
      return toDate(content)
    default:
      return content
  }

}

export function arrayTypeConvector(array: any[], type: Object[] | Object) {
  if (Array.isArray(type)) {
    const result = new Array(...array)
    type.forEach((t, index: number) => {
      if (result[index] !== undefined || result[index] !== null) {
        result[index] = typeConvector(result[index], t)
      }
    })
    return result
  } else {
    return array.map(value => typeConvector(value, type))
  }
}

function toBoolean(content): Boolean {
  if (typeof content === 'boolean') {
    return content
  } else if (typeof content === 'string') {
    if (content === 'true') {
      return true
    } else if (content === 'false') {
      return false
    }
  }
  return Boolean(content)
}

function toNumber(content: any) {
  if (typeof content === 'number') {
    return content
  }

  return Number(content)
}

function toDate(content: any) {
  if (content instanceof Date) {
    return content
  }

  return new Date(content)
}

function toString(content: any) {
  if (typeof content === 'string') {
    return content
  }

  String(content)
}