import {CtrFunc} from '../function-injector/ctr-func'
import {getControllerMetadata} from "./decorators/Controller";
import {initController} from "./util/controller";
import {MosideProcess} from "./util/process";
import {Moon} from "../moon/moon";
import {MoodAdapter} from "./util/mood.adapter";

export class Moside {
  proxyHandler: ProxyHandler<Object> = {
    // apply: async (target, context, argumentsList: [e.Request, e.Response, e.NextFunction]) => {
    //   const [ req, res, next] = argumentsList
    //   try {
    //     let cDi = Moside.createChildDi(di, req, res, next)
    //     let cFunc: CtrFunc = cDi.get(CtrFunc)
    //     let responseHandler: ResponseHandler = cDi.get(ResponseHandler)
    //     logger.info(`run prev plugins`)
    //     const result = await this.plugin_process(cDi, 'before')
    //
    //     //运行主业务流程
    //     if (result) {
    //       logger.debug(`Request (${cFunc.Class.constructor.name} -> ${cFunc.Function.name})`)
    //       await this.controller_process(cDi, target, context)
    //     }
    //
    //     await this.plugin_process(cDi, 'after')
    //
    //     logger.debug(`result: status:${
    //       responseHandler['_status']} message:${
    //       responseHandler['_message']} body:${
    //       JSON.stringify(responseHandler['_body'])}`)
    //
    //     responseHandler.response()
    //
    //     return res
    //   } catch (err) {
    //     logger.fatal(err)
    //     next(`{status: 0, message: '发生错误'}`)
    //   }
    //
    // }
  }
  private routerList: any[] = []
  private functions: CtrFunc[] = []
  private controllers: CtrFunc[] = []

  process: MosideProcess
  plugin: Moon

  protected constructor() {
    this.plugin = new Moon([
      new MoodAdapter
    ])

    this.process = new MosideProcess(
      this.plugin,
      this.postErrorMessage.bind(this)
    )
  }

  static create(routerList: any[], e: any): Moside {
    let ret = new Moside()
    ret.routerList = routerList
    ret.onInit()
    return ret
  }

  postErrorMessage(e: Error) {

  }

  // static createChildDi(di: FunctionDi, req: e.Request, res: e.Response, next: e.NextFunction) {
  //   let cFunc: CtrFunc = di.get(CtrFunc)
  //   const resMsg = getResMsg(cFunc)
  //   let responseHandler = new ResponseHandler(res, next, resMsg)
  //   const origin = new Origin(req, res)
  //   return di.createChild([{
  //     type: ResponseHandler,
  //     useValue: responseHandler
  //   }, {
  //     type: Origin,
  //     useValue: origin
  //   }])
  // }

  // async plugin_process(di: FunctionDi, type: 'before' | 'after') {
  //   let result = true
  //
  //   const List = type === 'before' ?
  //     this.prevPluginList : this.nextPluginList
  //
  //   for (const method of List) {
  //     const pluginResult = await di.resolveAndApply(method)
  //
  //     if (pluginResult === false) {
  //       logger.debug(`method: ${method[1].name} return false on ${type}ExpressControllerPlugin.`)
  //       result = false
  //     } else if (pluginResult && pluginResult !== true && type === 'before') {
  //       di.push([{type: pluginResult.constructor, useValue: pluginResult}])
  //     }
  //   }
  //
  //   return result
  // }

  // async controller_process(di: FunctionDi, target, context): Promise<ResponseHandler> {
  //   const cFunc: CtrFunc = di.get(CtrFunc)
  //   const origin: Origin = di.get(Origin)
  //   const responseHandler: ResponseHandler = di.get(ResponseHandler)
  //   const providers: Set<any> = Reflect.getMetadata(PROVIDER_LIST, cFunc.Class.constructor)
  //   logger.debug(`body:`, origin.request.body)
  //   logger.debug(`params:`, origin.request.params)
  //   logger.debug(`query:`, origin.request.query)
  //   const mood = Mood.create([
  //     ['body', origin.request.body],
  //     ['params', origin.request.params],
  //     ['query', origin.request.query]], providers)
  //
  //   const ret = mood.resolve(cFunc)
  //
  //   if (ret.result === false) {
  //     return responseHandler
  //       .status(201)
  //       .message('请求参数不正确')
  //   }
  //
  //   if (ret.body) {
  //     di.push(ret.body)
  //   }
  //
  //   // 获取func需要的参数
  //   return await di.resolveAndApply(new CtrFunc(context, target))
  // }

  private onInit() {
    initController(this.process, this.routerList)
  }

  private proxyController() {
    // this.routerList.forEach((controller: any) => {
    //   let cIns = new controller()
    //   let cFunctions = getControllerFunctions(cIns)
    //   let functions: CtrFunc[] = cFunctions.map(cFunction => {
    //     let func = new Proxy(cFunction, this.proxyHandler)
    //     return new CtrFunc(cIns, func)
    //   })
    //   this.functions.push(...functions)
    // })
  }

  private createRouter() {
    // this.functions.forEach(func => {
    //   let method = getControllerFunctionMethod(func)
    //   let cPath = getControllerPath(func.Class.constructor)
    //   let fPath = getControllerFunctionPath(func)
    //   if (!method) {
    //     return
    //   }
    //   logger.info(`bind: ${method}:'${path}' -> ${func.Class.constructor.name}:${func.Function.name}`)
    //   const di: FunctionDi = FunctionDi.create([{
    //     type: CtrFunc,
    //     useValue: func
    //   }])
    //   this.expressRouter[method](path, (res, req, next) => func.getFunc()(di, res, req, next))
    // })
  }

  private initControllers() {
    this.routerList.forEach((controller: any) => {
      let cIns = new controller()
      console.log(cIns)
      let cFunctions = getControllerMetadata(controller)
      console.log(cFunctions)
      // let functions: CtrFunc[] = cFunctions.map(cFunction => {
      //   let func = new Proxy(cFunction, this.proxyHandler)
      //   return new CtrFunc(cIns, func)
      // })
      // this.functions.push(...functions)
    })
  }
}