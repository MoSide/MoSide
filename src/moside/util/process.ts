import {getControllerMethodMetadata} from "../decorators/HttpMethod";
import {IControllerMetadata, IControllerMethodMetadata} from "../controller.interface";
import {getControllerMetadata} from "../decorators/Controller";
import {Ctx} from "../ctx";
import {TypeProvider} from "../../function-injector/type-provider.interface";
import {CtrFunc} from "../../function-injector/ctr-func";
import {FunctionInjector} from "../../function-injector/function-injector";

function createMethodInjector(injector: FunctionInjector, {request, response}): FunctionInjector {
  const ctxProvider: TypeProvider = {
    token: Ctx,
    useValue: new Ctx(request, response)
  }
  return injector.createChild([ctxProvider])
}

class Process {
  globalProvider: any[] = []

  proxyHandler: ProxyHandler<Object> = {
    get: (target: Object, p: string, receiver: any): any => {
      const m = Reflect.get(target, p, receiver)
      if (typeof m !== 'function') {
        return m
      }

      const mMeta: IControllerMethodMetadata = getControllerMethodMetadata(target, p)
      if (!mMeta) {
        return m
      }

      const cMeta: IControllerMetadata = getControllerMetadata(target)
      return (request, response) => {
        const injector = createMethodInjector(cMeta.injector, {
          request,
          response
        })

        injector.resolveAndApply(
          new CtrFunc(target, p)
        )
      }
    }
  }

  bindHandler(ctr: any) {
    return new Proxy(ctr, this.proxyHandler)
  }

}

export const ctrProcess = new Process()
