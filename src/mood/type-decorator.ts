import 'reflect-metadata'
import {IModelProperty} from './model-property.interface'
import {MetadataArray} from '../utils/metadata-array'

export let ARRAY_TYPE = 'array_type'
export let PARAMETERS = 'response:parameters'

export function _TypeDecorator(Type: symbol) {
  return function (target: any, propertyKey: string) {
    const type: string = Reflect.getMetadata('design:type', target, propertyKey)

    if (type) {
      const p: IModelProperty = {
        property: propertyKey,
        type: type
      }

      const parameters: IModelProperty[] = MetadataArray(Type, target)
      parameters.push(p)

      let types: Set<symbol> = Reflect.getMetadata(PARAMETERS, target)
      if (!types) {
        types = new Set()
        Reflect.defineMetadata(PARAMETERS, types, target)
      }

      types.add(Type)
    }
  }
}

export function ArrayType(Type: Object) {
  return function (target: any, propertyKey: string) {
    if (Type) {
      Reflect.defineMetadata(ARRAY_TYPE, Type, target, propertyKey)
    }
  }
}
