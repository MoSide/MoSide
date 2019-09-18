import { getControllerMethodMetadata } from '..'
import { IControllerMetadata, IControllerMethodMetadata } from '../controller.interface'
import { getControllerMetadata } from '..'
import { Ctx } from '../ctx'
import { TypeProvider } from '../../function-injector'
import { FunctionInjector } from '../../function-injector'
import { Moon } from '../../moon/moon'
import { PluginInterface } from '../../moon'
import { CtrFunc } from '../../function-injector'
import { Response } from '../../response-handler'
import { runCycleLife } from './controller'
import { MethodCtx } from './method-ctx'
import { Mood } from '../../mood/mood'


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

          const mood = Mood.create([
            ['params', request.params],
            ['query', request.query],
            ['body', request.body]
          ])

          const injector = createMethodInjector({
            request,
            response,
            mood,
            responseHandler,
            methodCtx
          })

          let result

          result = await this.pluginProcess('before', injector, [
            ...cMeta.plugins,
            ...mMeta.plugins
          ])

          if (result && result.status === false) {
            if (!responseHandler['_body']) {
              responseHandler.status(500).body({ code: -1, err: result.result})
            }
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

          if (result && result.status === false) {
            if (!responseHandler['_body']) {
              responseHandler.status(500).body({code: -1, err: result.result})
            }
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

  async pluginProcess(stage: 'before' | 'after', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<{ status: boolean, index?: number, result?: string }> {
    return await this.moon.run(stage, injector, extraPlugins)
  }

  bindHandler(ctr: any) {
    return new Proxy(ctr, this.proxyHandler)
  }

}

function createMethodInjector({request, response, mood, responseHandler, methodCtx}): FunctionInjector {
  const ctxProvider: TypeProvider = {
    token: Ctx,
    useValue: new Ctx(request, response)
  }

  const moodProvider: TypeProvider = {
    token: Mood,
    useValue: mood
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
    moodProvider,
    respHandlerProvider,
    respHandlerProvider2,
    methodCtxProvider
  ])
}

