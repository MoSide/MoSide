import {ARRAY_TYPE} from "./constant";

export function ArrayType(type: Object | Object[]) {
  return function (target: any, propertyKey: string) {
    if (type) {
      Reflect.defineMetadata(ARRAY_TYPE, type, target, propertyKey)
    }
  }
}

export function getArrayTypeMeta(target: Object, key: string): Object | Object[] | undefined {
  return Reflect.getMetadata(ARRAY_TYPE, target, key)
}