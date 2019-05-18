import { MOOD_ARRAY_TYPE } from './constant'

export function ArrayType(type: Object | Object[]) {
  return function (target: any, propertyKey: string) {
    if (type) {
      Reflect.defineMetadata(MOOD_ARRAY_TYPE, type, target, propertyKey)
    }
  }
}

export function getArrayTypeMeta(target: Object, key: string): Object | Object[] | undefined {
  return Reflect.getMetadata(MOOD_ARRAY_TYPE, target, key)
}
