import 'reflect-metadata'
import {IParameter} from '../function-injector/parameter.interface'
import {MetadataArray} from '../utils/metadata-array'
import {Parameter} from './parameter.enum'
import {MOOD_PARAMETERS} from './constant'

function getTarget(method: Parameter, prop: string) {
  return method + '.' + prop
}

export function Inject(method: Parameter, prop: string, defaultValue: any = null) {
  return (target: Object, propertyKey: string, pIndex: number) => {
    const targetPoint = getTarget(method, prop)
    const param = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    (<IParameter[]>MetadataArray(MOOD_PARAMETERS, target, propertyKey)).push({
      token: targetPoint,
      type: param[pIndex],
      index: pIndex,
      target: targetPoint,
      spec: true,
      defaultValue
    })
  }
}

