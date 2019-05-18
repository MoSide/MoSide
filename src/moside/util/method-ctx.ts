import { CtrFunc } from '../../function-injector'
import { IParameter } from '../../function-injector/parameter.interface'

export class MethodCtx {

  private ctx: CtrFunc

  constructor(context: Object, prop: string) {
    this.ctx = new CtrFunc(context, prop)
  }

  get parameters(): IParameter[] {
    return this.ctx.parameters
  }

  getMetadata(key: string | symbol) {
    return this.ctx.getMetadata(key)
  }

  getOriginParams(): any[] {
    return this.ctx.getOriginParams()
  }
}
