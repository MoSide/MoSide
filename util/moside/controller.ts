import {PATH, PROVIDER_LIST} from './symbol'
import {ControllerOptions} from '../interface/controller-options.interface'

export function Controller(options?: ControllerOptions) {
  return (target: any) => {

    if (options && options.providers) {
      const s: Set<any> = new Set(options.providers)
      Reflect.defineMetadata(PROVIDER_LIST, s, target)
    }

    let path: String
    if (options && options.path) {
      path = options.path
    } else {
      const cInsName = target.name
      path = `/${cInsName.replace('Controller', '').toLowerCase()}`
    }
    Reflect.defineMetadata(PATH, path, target)
  }
}

export function getControllerPath(controller: any) {
  return Reflect.getMetadata(PATH, controller)
}

export function getControllerProviders(controller: any) {
  return Reflect.getMetadata(PROVIDER_LIST, controller)
}

/**
 * Created by yskun on 2017/7/7.
 * MoProject COPYRIGHT
 */
