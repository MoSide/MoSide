import {IControllerMetadata} from '../controller.interface'
import {getControllerMetadata} from '..'
import {MosideProcess} from './process'
import {IHttpMethod} from '../method.interface'
import {CtrFunc} from '../../function-injector'


export async function initController(process: MosideProcess, routerList: any[]): Promise<IHttpMethod[]> {
  if (!Array.isArray(routerList)) {
    return []
  }
  const methods: IHttpMethod[] = []

  await Promise.all(routerList.map(async (controller) => {
    const cMeta: IControllerMetadata = getControllerMetadata(controller)
    const cIns = new controller()
    // 绑定代理
    const ctx = bindCtrProxy(process, cIns)

    cMeta.methods.forEach((cMethod) => {
      const path = getCtrMethodPath(cMeta.path, cMethod.path)

      methods.push({
        path,
        method: cMethod.method,
        target: new CtrFunc(ctx, cMethod.key)
      })
    })

    // 执行onInit
    return runCycleLife('onInit', cIns)
  }))

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
  return ctrProcess.bindHandler(ctr)
}
