import {TypeProvider} from './type-provider.interface'
import {logger} from '../utils/logger'
import {IParameter} from './parameter.interface'
import {CtrFunc} from './ctr-func'

export class FunctionInjector {

  THROW_ERROR: boolean = true
  private params: Map<any, any> = new Map()
  private parent: FunctionInjector

  protected constructor() {
  }

  static create(providers: TypeProvider[], throwError: boolean = true): FunctionInjector {
    const fun = new FunctionInjector()
    fun.THROW_ERROR = throwError
    fun.push([{token: FunctionInjector, useValue: fun}, ...providers])
    return fun
  }

  createChild(providers?: TypeProvider[]): FunctionInjector {
    const injector = FunctionInjector.create(providers || [], this.THROW_ERROR)
    injector.parent = this
    return injector
  }

  push(providers: TypeProvider[]) {
    providers.forEach(({token, useValue}) => {
      // todo 此处应抛出错误？
      if (token === null || token === undefined) {
        return logger.debug(`a provider hasn't prop 'type' or 'useValue`)
      }

      if (useValue === undefined) {
        return logger.debug(`a provider hasn't prop 'type' or 'useValue`)
      }

      this.params.set(token, useValue)
    })
  }

  get(type: any | any[]): any {
    if (Array.isArray(type)) {
      return type.map(t => {
        return this.getParam(t) || null
      })
    } else {
      return this.getParam(type)
    }
  }

  async resolveAndApply(target: CtrFunc | CtrFunc[], stopSignal?: any): Promise<any | any[]> {
    if (Array.isArray(target)) {
      const result: any[] = []
      let index = 0
      for (const cFunc of target) {
        const status = await this._resolveAndApply(cFunc)
        if (stopSignal !== undefined && status === stopSignal) {
          return [{
            status: false,
            index
          }]
        }
        result.push(status)
        index++
      }

      result.unshift({
        status: true
      })

      return result
    } else {
      return await this._resolveAndApply(target)
    }
  }

  async _resolveAndApply(func: CtrFunc): Promise<any> {
    return await func.apply(
      this.resolve(func)
    )
  }

  resolve(cFunc: CtrFunc): any[] {
    const cFunParams: IParameter[] = cFunc.parameters

    return cFunParams.map(parameter => {
      const param = this.getParam(parameter.token)

      if (param === void 0) {
        throw new Error(
          `${cFunc.targetType.name}(${cFunc.prop}) -> ${parameter.type.name || parameter.type}(${parameter.index}) has no provider`
        )
      }

      return param || null
    })
  }

  private getParam(type: any) {
    if (this.params.has(type)) {
      return this.params.get(type)
    } else {
      if (this.parent) {
        return this.parent.getParam(type)
      } else {
        return void 0
      }
    }
  }
}
