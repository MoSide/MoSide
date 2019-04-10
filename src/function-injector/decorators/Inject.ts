import 'reflect-metadata'
import {PARAMS} from "../../moside/symbol";
import {MetadataArray} from "../../utils/metadata-array";
import {IParameter} from "../parameter.interface";
import {getSymbolDescription} from "../../utils/get-symbol-description";

function getTarget(method: symbol, prop: string) {
  const method_str = getSymbolDescription(method)
  return method_str + ':' + prop
}


export function Inject(method: symbol, prop: string) {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    const specParam: IParameter[] = MetadataArray(PARAMS, target, <string>propertyKey)
    const parameters = Reflect.getMetadata('design:paramtypes', target, propertyKey)
    specParam[parameterIndex] = {
      type: parameters[parameterIndex],
      target: getTarget(method, prop),
      spec: true,
      index: parameterIndex
    }
  }
}

