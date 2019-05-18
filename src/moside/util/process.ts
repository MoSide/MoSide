import { getControllerMethodMetadata } from '../decorators/HttpMethod'
import { IControllerMetadata, IControllerMethodMetadata } from '../controller.interface'
import { getControllerMetadata } from '../decorators/Controller'
import { Ctx } from '../ctx'
import { TypeProvider } from '../../function-injector/type-provider.interface'
import { FunctionInjector } from '../../function-injector/function-injector'
import { Moon } from '../../moon/moon'
import { PluginInterface } from '../../moon/plugin.interface'
import { CtrFunc } from '../../function-injector/ctr-func'
import { Response } from '../../response-handler/response'
import { runCycleLife } from './controller'
import { MethodCtx } from './method-ctx'


export class MosideProcess {

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
      return async (request, response, next) => {
        const responseHandler: Response = new Response(response, next)
        try {
          const methodCtx: MethodCtx = new MethodCtx(target, p)

          const injector = createMethodInjector({
            request,
            response,
            responseHandler,
            methodCtx
          })

          let result

          result = await this.pluginProcess('before', injector, [
            ...cMeta.plugins,
            ...mMeta.plugins
          ])

          if (!result) {
            // todo
            return responseHandler.response()
          }

          await injector.resolveAndApply(
            new CtrFunc(target, p)
          )

          result = await this.pluginProcess('after', injector, [
            ...cMeta.plugins,
            ...mMeta.plugins
          ])

          if (!result) {
            // todo
          }

          responseHandler.response()
        } catch (e) {
          const result = await runCycleLife('onError', target)
          if (result !== false) {
            this.errorHook(e)
            next(e)
            // todo resp error
          }
        }
      }
    }
  }

  constructor(private moon: Moon, private errorHook: Function) {
  }

  async pluginProcess(stage: 'before' | 'after', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<boolean> {
    return await this.moon.run(stage, injector, extraPlugins)
  }

  bindHandler(ctr: any) {
    return new Proxy(ctr, this.proxyHandler)
  }

}

function createMethodInjector({request, response, responseHandler, methodCtx}): FunctionInjector {
  const ctxProvider: TypeProvider = {
    token: Ctx,
    useValue: new Ctx(request, response)
  }

  const respHandlerProvider: TypeProvider = {
    token: responseHandler.constructor,
    useValue: responseHandler
  }

  const respHandlerProvider2: TypeProvider = {
    token: Response,
    useValue: responseHandler
  }

  const methodCtxProvider: TypeProvider = {
    token: MethodCtx,
    useValue: methodCtx
  }

  return FunctionInjector.create([
    ctxProvider,
    respHandlerProvider,
    respHandlerProvider2,
    methodCtxProvider
  ])
}

