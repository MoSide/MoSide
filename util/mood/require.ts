import 'reflect-metadata'
import {MetadataArray} from '../common/metadata-array'
import {IParameter} from '../interface/parameter.interface'
import {PARAMS} from '../moside/symbol'

export function Require(target: any, prop: string, index?: number) {
  if (!index) {
    Reflect.defineMetadata('parameters:require', true, target, prop)
  } else {
    const specParam: IParameter[] = MetadataArray(PARAMS, target, <string>prop)
    if (specParam[index]) {
      specParam[index].require = true
    } else {
      throw new Error(`Require Decorator must after Type Decorator`)
    }
  }
}
