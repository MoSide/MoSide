import { MOOD_MODEL } from './constant'

export function Model(target: Object) {
  Reflect.defineMetadata(MOOD_MODEL, true, target)
}

export function getModelMeta(target: Object): boolean {
  return Reflect.getMetadata(MOOD_MODEL, target) || false
}
