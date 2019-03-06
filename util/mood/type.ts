import 'reflect-metadata'
import {getSymbolDescription} from '../common/get-symbol-description'
import {IParameter} from '../interface/parameter.interface'
import {MetadataArray} from '../common/metadata-array'
import {PARAMS} from '../moside/symbol'

function getTarget(method: symbol, prop: string) {
  const method_str = getSymbolDescription(method)
  return method_str + ':' + prop
}


// todo 这个改一下名字
export function Type(method: symbol, prop: string) {
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

