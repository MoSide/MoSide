import {CtrFunc} from "../../function-injector/ctr-func";

export class MethodCtx extends CtrFunc {

  // todo 调整设计模式
  constructor(context: Object, prop: string) {
    super(context, prop)
  }

  get func(): never {
    throw Error(`Method Ctx does not support this method`)
  }

  apply(params: any[]): never {
    throw Error(`Method Ctx does not support this method`)
  }

  setMetadata(key: string | symbol, meta: any): never {
    throw Error(`Method Ctx does not support this method`)
  }

}