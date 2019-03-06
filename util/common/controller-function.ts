import 'reflect-metadata'
import {IParameter} from '../interface/parameter.interface'
import {PARAMS} from '../moside/symbol'

export class ControllerFunction {

  constructor(public Class: any, public  Function: Function) {
  }

  getMetadata(key: string | symbol) {
    return Reflect.getMetadata(key, this.Class, this.Function.name)
  }

  getParameters() {

    let funDIParams: IParameter[] = Reflect.getMetadata('fundi:params', this.Class, this.Function.name)
    if (!funDIParams) {
      funDIParams = []
      const cFunParams: any[] = Reflect.getMetadata('design:paramtypes', this.Class, this.Function.name)
      const specParams: IParameter[] = Reflect.getMetadata(PARAMS, this.Class, this.Function.name)

      if (specParams) {
        specParams.forEach(value => {
          funDIParams[value.index] = value
        })
      }

      cFunParams.forEach((value, index) => {
        if (!funDIParams[index]) {
          funDIParams[index] = {
            type: value,
            index: index,
            spec: false
          }
        }
      })
      Reflect.defineMetadata('fundi:params', funDIParams, this.Class, this.Function.name)
    }
    return funDIParams
  }

  getFunc() {
    return this.Function.bind(this.Class)
  }

}
