import 'reflect-metadata'
import {IParameter} from './parameter.interface'
import {PARAMETERS} from '../moside/symbol'

export class CtrFunc {

  constructor(public context: any, public  prop: string) {
  }

  private _parameters: IParameter[]

  get parameters(): IParameter[] {
    if (!this._parameters) {
      const parameters: IParameter[] = this.getMetadata('fun:params')

      if (!parameters) {
        throw new Error(`the func ${this.targetType.name}(${this.prop}) has not decorate by Injectable`)
      }

      const specParams: IParameter[] = this.getMetadata(PARAMETERS)

      this._parameters = new Array(...parameters)

      if (specParams && Array.isArray(specParams)) {
        specParams.forEach(param => {
          this._parameters[param.index] = param
        })
      }
    }

    return this._parameters
  }

  get func() {
    return Reflect.get(this.context, this.prop)
  }

  get targetType() {
    return this.context.constructor
  }

  getMetadata(key: string | symbol) {
    return Reflect.getMetadata(key, this.context, this.prop)
  }

  setMetadata(key: string | symbol, meta: any) {
    return Reflect.defineMetadata(key, meta, this.context, this.prop)
  }

  getOriginParams(): any[] {
    return this.getMetadata('design:paramtypes')
  }

  apply(...params: any[]) {
    Reflect.apply(this.func, this.context, params)
  }
}
