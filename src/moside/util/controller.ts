import {IControllerMetadata} from "../controller.interface";
import {getControllerMetadata} from "../decorators/Controller";
import {MosideProcess} from "./process";


export function initController(process: MosideProcess, routerList: any[]) {
  if (!Array.isArray(routerList)) {
    return []
  }
  const methods: any[] = []

  // todo 这里可能需要做异步处理
  routerList.forEach(async controller => {
    const cMeta: IControllerMetadata = getControllerMetadata(controller)
    const cIns = new controller()
    // 绑定代理
    bindCtrProxy(process, cIns)

    // 执行onInit
    await runCycleLife('onInit', cIns)

    return cMeta.methods.forEach(cMethod => {
      const path = getCtrMethodPath(cMeta.path, cMethod.path)

      methods.push({
        path,
        method: cMethod.method,
        target: cIns[cMethod.key].bind(cIns)
      })
    })
  })

  return methods
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
  const _ctr = ctrProcess.bindHandler(ctr)
  _ctr['index']('1234560')
}
