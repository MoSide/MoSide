import {IControllerMetadata} from "../controller.interface";
import {getControllerMetadata} from "../decorators/Controller";
import {MosideProcess} from "./process";
import {IHttpMethod} from "../method.interface";
import {CtrFunc} from "../../function-injector/ctr-func";


export async function initController(process: MosideProcess, routerList: any[]): Promise<IHttpMethod[]> {
  if (!Array.isArray(routerList)) {
    return []
  }
  const methods: IHttpMethod[] = []

  // todo 这里可能需要做异步处理
  await asyncForeach(routerList, async controller => {
    const cMeta: IControllerMetadata = getControllerMetadata(controller)
    const cIns = new controller()
    // 绑定代理
    const ctx = bindCtrProxy(process, cIns)

    // 执行onInit
    await runCycleLife('onInit', cIns)

    await asyncForeach(cMeta.methods, cMethod => {
      const path = getCtrMethodPath(cMeta.path, cMethod.path)

      methods.push({
        path,
        method: cMethod.method,
        target: new CtrFunc(ctx, cMethod.key)
      })
    })
  })

  return methods
}

async function asyncForeach<T>(array: T[], callback: (value: T, index: number, arr: T[]) => any) {
  for (const index in array) {
    await callback(array[index], <any>index, array)
  }
}

export async function runCycleLife(hook: string, context: any) {
  if (context && typeof context[hook] === 'function') {
    return await context[hook].call(context)
  }
}

function getCtrMethodPath(cPath: string = '', mPath: string = '') {
  if (mPath === '/') {
    return cPath
  } else {
    return (cPath === '/' ? '' : cPath) + mPath
  }
}

function bindCtrProxy(ctrProcess: MosideProcess, ctr: any) {
  return ctrProcess.bindHandler(ctr)
}
