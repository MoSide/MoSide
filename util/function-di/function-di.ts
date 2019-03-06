import {TypeProvider} from '../interface/type-provider.interface'
import {logger} from '../common/logger'
import {IParameter} from '../interface/parameter.interface'
import {ControllerFunction} from '../common/controller-function'


export class FunctionDi {

  THROW_Error: Boolean = true
  private params: Map<any, any> = new Map()
  private parent: FunctionDi

  private constructor() {
  }

  static create(providers: TypeProvider[], throwError: boolean = true): FunctionDi {
    const fun = new FunctionDi()
    fun.THROW_Error = throwError
    fun.push([{type: FunctionDi, useValue: this}])
    fun.push(providers)
    return fun
  }

  createChild(providers?: TypeProvider[]): FunctionDi {
    const fun = new FunctionDi()
    fun.THROW_Error = this.THROW_Error
    fun.parent = this
    this.params.set(FunctionDi, this)
    if (providers instanceof Array) {
      fun.push(providers)
    }
    return fun
  }

  push(providers: Array<TypeProvider>) {
    for (const provider of providers) {
      if (provider.type === null || provider.type === undefined) {
        logger.debug(`provider (${provider}) hasn't prop 'type' or 'useValue`)
        continue
      }

      if (provider.useValue === undefined) {
        logger.debug(`provider (${provider}) hasn't prop 'type' or 'useValue`)
        continue
      }

      this.params.set(provider.type, provider.useValue)
    }
  }

  get(type: any): any {
    return this.getParam(type)
  }

  async resolveAndApply(target: ControllerFunction | ControllerFunction[]): Promise<null | any> {
    if (target instanceof Array) {
      for (const cFunc of target) {
        const params = this.resolve(cFunc)
        await cFunc.Function.apply(cFunc.Class, params)
      }
    } else {
      const params = this.resolve(target)
      return await target.Function.apply(target.Class, params)
    }
  }

  private getParam(type: any) {
    if (this.params.has(type)) {
      return this.params.get(type)
    } else {
      if (this.parent) {
        return this.parent.getParam(type)
      } else {
        return undefined
      }
    }
  }

  private resolve(cFunc: ControllerFunction): Object[] {
    const ret: any[] = []

    const cFunParams: IParameter[] = cFunc.getParameters()

    for (const member of cFunParams) {
      let param
      if (member.target) {
        param = this.getParam(member.target)
      } else {
        param = this.getParam(member.type)
      }

      if (param !== undefined) {
        ret.push(param)
      } else {
        if (this.THROW_Error) {
          throw new Error(
            `${cFunc.Class.constructor.name}(${cFunc.Function.name}) -> ${member.type.name ? member.type.name : member.type} has no provider`)
        }
        ret.push({})
      }
    }

    return ret
  }
}
