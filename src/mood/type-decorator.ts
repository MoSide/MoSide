import 'reflect-metadata'
import {IModelProperty} from './model-property.interface'
import {MetadataArray} from '../utils/metadata-array'
import {Parameter} from "./parameter.enum";
import {PARAMETERS} from "./constant";

export function HttpParameter(paramType: Parameter | string) {
  return function (target: any, propertyKey: string) {
    const type: string = Reflect.getMetadata('design:type', target, propertyKey)

    if (type) {
      const p: IModelProperty = {
        property: propertyKey,
        type
      }

      MetadataArray(paramType, target).push(p)
      let types: Set<string> = Reflect.getMetadata(PARAMETERS, target)
      if (!types) {
        types = new Set()
        Reflect.defineMetadata(PARAMETERS, types, target)
      }
      types.add(paramType)
    }
  }
}

export const Query = HttpParameter(Parameter.query)
export const PathParameter = HttpParameter(Parameter.path)
export const Body = HttpParameter(Parameter.body)

