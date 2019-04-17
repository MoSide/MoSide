import {IParameter} from "./parameter.interface";

export function Injectable(target: Object, prop: string) {
  const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', target, prop)
  const parameters: IParameter[] = paramTypes.map((value, index) => {
    return {
      token: value,
      type: value,
      index: index
    }
  })
  Reflect.defineMetadata('fun:params', parameters, target, prop)
}