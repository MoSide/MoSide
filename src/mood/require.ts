import 'reflect-metadata'
import {MetadataArray} from '../utils/metadata-array'
import {IParameter} from '../function-injector/parameter.interface'
import {PARAMETERS} from '../moside/symbol'

export const PARAM_REQUIRE = 'parameters:require'

export function Require(target: any, prop: string, index?: number) {
  if (!index) {
    Reflect.defineMetadata(PARAM_REQUIRE, true, target, prop)
  } else {
    const specParam: IParameter[] = MetadataArray(PARAMETERS, target, <string>prop)
    if (specParam[index]) {
      specParam[index].require = true
    } else {
      throw new Error(`Require Decorator must after Type Decorator`)
    }
  }
}

export function getRequireMetadata(target: any, prop: string): boolean {
  return Reflect.getMetadata(PARAM_REQUIRE, target, prop) || false
}
