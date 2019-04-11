import 'reflect-metadata'
import {IParameter} from "../function-injector/parameter.interface";
import {MetadataArray} from "../utils/metadata-array";
import {PARAMETERS} from "./type-decorator";

function getTarget(method: Parameter, prop: string) {
  return method + '.' + prop
}

export const enum Parameter {
  path = 'param',
  body = 'body',
  query = 'query'
}


export function Inject(method: Parameter, prop: string) {
  return (target: Object, propertyKey: string, pIndex: number) => {
    const targetPoint = getTarget(method, prop)
    const param = Reflect.getMetadata('design:paramtypes', target, propertyKey);
    (<IParameter[]>MetadataArray(PARAMETERS, target, propertyKey)).push({
      token: targetPoint,
      type: param[pIndex],
      index: pIndex,
      target: targetPoint,
      spec: true,
    })
  }
}

