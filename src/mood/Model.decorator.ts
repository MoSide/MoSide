import {MODEL} from "./constant";

export function Model(target: Object) {
  Reflect.defineMetadata(MODEL, true, target)
}

export function getModelMeta(target: Object): boolean {
  return Reflect.getMetadata(MODEL, target) || false
}