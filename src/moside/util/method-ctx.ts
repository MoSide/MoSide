import {CtrFunc} from "../../function-injector/ctr-func";

export class MethodCtx extends CtrFunc {
  get func(): never {
    throw Error(`Method Ctx does not support this method`)
  }

  get context(): never {
    throw Error(`Method Ctx does not support this method`)
  }

  get prop(): never {
    throw Error(`Method Ctx does not support this method`)
  }

  apply(params: any[]): never {
    throw Error(`Method Ctx does not support this method`)
  }

  setMetadata(key: string | symbol, meta: any): never {
    throw Error(`Method Ctx does not support this method`)
  }

}