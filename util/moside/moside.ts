import {logger} from '../common/logger'
import {getControllerFunctionMethod, getControllerFunctionPath, getControllerFunctions} from './method'
import {ControllerFunction} from '../common/controller-function'
import * as e from 'express'
import {FunctionDi} from '../function-di/function-di'
import {Origin} from './origin'
import {getResMsg} from './express'
import {ResponseHandler} from './response.handler'
import {PROVIDER_LIST} from './symbol'
import {Mood} from '../mood/mood'
import {getControllerPath} from './controller'

export class Moside {
  proxyHandler: ProxyHandler<Object> = {
    apply: async (target, context, argumentsList: [FunctionDi, e.Request, e.Response, e.NextFunction]) => {
      const [di, req, res, next] = argumentsList
      try {
        let cDi = Moside.createChildDi(di, req, res, next)
        let cFunc: ControllerFunction = cDi.get(ControllerFunction)
        let responseHandler: ResponseHandler = cDi.get(ResponseHandler)
        logger.info(`run prev plugins`)
        const result = await this.plugin_process(cDi, 'before')

        //运行主业务流程
        if (result) {
          logger.debug(`Request (${cFunc.Class.constructor.name} -> ${cFunc.Function.name})`)
          await this.controller_process(cDi, target, context)
        }

        await this.plugin_process(cDi, 'after')

        logger.debug(`result: status:${
          responseHandler['_status']} message:${
          responseHandler['_message']} body:${
          JSON.stringify(responseHandler['_body'])}`)

        responseHandler.response()

        return res
      } catch (err) {
        logger.fatal(err)
        next(`{status: 0, message: '发生错误'}`)
      }

    }
  }
  private routerList: any[] = []
  private functions: ControllerFunction[] = []
  private expressRouter: e.Router
  private prevPluginList: ControllerFunction[] = []
  private nextPluginList: ControllerFunction[] = []

  protected constructor() {
  }

  static create(routerList: any[], e: any): Moside {
    let ret = new Moside()
    ret.routerList = routerList
    ret.expressRouter = new e.Router()
    ret.onInit()
    return ret
  }

  static createChildDi(di: FunctionDi, req: e.Request, res: e.Response, next: e.NextFunction) {
    let cFunc: ControllerFunction = di.get(ControllerFunction)
    const resMsg = getResMsg(cFunc)
    let responseHandler = new ResponseHandler(res, next, resMsg)
    const origin = new Origin(req, res)
    return di.createChild([{
      type: ResponseHandler,
      useValue: responseHandler
    }, {
      type: Origin,
      useValue: origin
    }])
  }

  private static getFinalPath(cPath: string, mPath: string): string {
    // todo
    if (mPath === '/') {
      return cPath
    } else {
      return (cPath === '/' ? '' : cPath) + mPath
    }
  }

  addPlugins() {

  }

  async plugin_process(di: FunctionDi, type: 'before' | 'after') {
    let result = true

    const List = type === 'before' ?
      this.prevPluginList : this.nextPluginList

    for (const method of List) {
      const pluginResult = await di.resolveAndApply(method)

      if (pluginResult === false) {
        logger.debug(`method: ${method[1].name} return false on ${type}ExpressControllerPlugin.`)
        result = false
      } else if (pluginResult && pluginResult !== true && type === 'before') {
        di.push([{type: pluginResult.constructor, useValue: pluginResult}])
      }
    }

    return result
  }

  async controller_process(di: FunctionDi, target, context): Promise<ResponseHandler> {
    const cFunc: ControllerFunction = di.get(ControllerFunction)
    const origin: Origin = di.get(Origin)
    const responseHandler: ResponseHandler = di.get(ResponseHandler)
    const providers: Set<any> = Reflect.getMetadata(PROVIDER_LIST, cFunc.Class.constructor)
    logger.debug(`body:`, origin.request.body)
    logger.debug(`params:`, origin.request.params)
    logger.debug(`query:`, origin.request.query)
    const mood = Mood.create([
      ['body', origin.request.body],
      ['params', origin.request.params],
      ['query', origin.request.query]], providers)

    const ret = mood.resolve(cFunc)

    if (ret.result === false) {
      return responseHandler
        .status(201)
        .message('请求参数不正确')
    }

    if (ret.body) {
      di.push(ret.body)
    }

    // 获取func需要的参数
    return await di.resolveAndApply(new ControllerFunction(context, target))
  }

  getRouter() {
    return this.expressRouter
  }

  private onInit() {
    this.proxyController()
    this.createRouter()
  }

  private proxyController() {
    this.routerList.forEach((controller: any) => {
      let cIns = new controller()
      let cFunctions = getControllerFunctions(cIns)
      let functions: ControllerFunction[] = cFunctions.map(cFunction => {
        let func = new Proxy(cFunction, this.proxyHandler)
        return new ControllerFunction(cIns, func)
      })
      this.functions.push(...functions)
    })
  }

  private createRouter() {
    this.functions.forEach(func => {
      let method = getControllerFunctionMethod(func)
      let cPath = getControllerPath(func.Class.constructor)
      let fPath = getControllerFunctionPath(func)
      let path = Moside.getFinalPath(cPath, fPath)
      if (!method) {
        return
      }
      logger.info(`bind: ${method}:'${path}' -> ${func.Class.constructor.name}:${func.Function.name}`)
      const di: FunctionDi = FunctionDi.create([{
        type: ControllerFunction,
        useValue: func
      }])
      this.expressRouter[method](path, (res, req, next) => func.getFunc()(di, res, req, next))
    })
  }

}