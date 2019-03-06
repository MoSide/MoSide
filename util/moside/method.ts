import 'reflect-metadata'
import {MetadataArray} from '../common/metadata-array'
import {CONTROLLER, METHOD, PATH} from './symbol'
import {ControllerFunction} from '../common/controller-function'

export function Method(method: 'get' | 'post' | 'delete' | 'put' | 'options', path?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const ControllerMethod = MetadataArray(CONTROLLER, target)

    ControllerMethod.push(target[propertyKey])

    Reflect.defineMetadata(METHOD, method, target, propertyKey)

    if (!path) {
      path = '/' + propertyKey
    }

    Reflect.defineMetadata(PATH, path, target, propertyKey)
  }
}

export function getControllerFunctionMethod(controllerFunc: ControllerFunction) {
  return controllerFunc.getMetadata(METHOD)
}

export function getControllerFunctionPath(controllerFunc: ControllerFunction) {
  return controllerFunc.getMetadata(PATH)
}

export function getControllerFunctions(context: any) {
  return Reflect.getMetadata(CONTROLLER, context)
}

/**
 * Created by yskun on 2017/7/7.
 * MoProject COPYRIGHT
 */
