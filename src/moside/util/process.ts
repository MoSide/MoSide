import { getControllerMetadata, getControllerMethodMetadata } from '..'
import { IControllerMetadata, IControllerMethodMetadata } from '../controller.interface'
import { Ctx } from '../ctx'
import { CtrFunc, FunctionInjector, TypeProvider } from '../../function-injector'
import { Moon } from '../../moon/moon'
import { PluginInterface } from '../../moon'
import { Response } from '../../response-handler'
import { runCycleLife } from './controller'
import { MethodCtx } from './method-ctx'
import { Mood } from '../../mood/mood'
import { Reason } from './reason'


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

          const extraPlugins = [
            ...cMeta.plugins,
            ...mMeta.plugins
          ]

          let result

          result = await this.pluginProcess('before', injector, extraPlugins)

          if (result && result.status === false) {
            if (!responseHandler['_body']) {
              responseHandler.status(500).body({code: -1, err: result.result})
            }
            // todo
            return responseHandler.response()
          }

          await this.runController(injector, new CtrFunc(target, p), extraPlugins)

          result = await this.pluginProcess('after', injector, extraPlugins)

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

  async pluginProcess(stage: 'before' | 'after' | 'error', injector: FunctionInjector, extraPlugins: PluginInterface[]): Promise<{ status: boolean, index?: number, result?: string }> {
    return await this.moon.run(stage, injector, extraPlugins)
  }

  bindHandler(ctr: any) {
    return new Proxy(ctr, this.proxyHandler)
  }

  private async runController(injector: FunctionInjector, controller: CtrFunc, extraPlugins: PluginInterface[]) {
    try {
      await injector.resolveAndApply(
        controller
      )
    } catch (e) {
      const errInjector = injector.createChild([{
        token: Reason,
        useValue: new Reason(e)
      }])
      const {status} = await this.pluginProcess('error', errInjector, extraPlugins)
      if (!status) {
        throw e
      }
    }
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

