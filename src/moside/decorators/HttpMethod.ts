import 'reflect-metadata'
import {getControllerMetadata} from './Controller'
import {IControllerMethodMetadata, IHttpMethodFunction} from '../controller.interface'
import {METHOD} from '../symbol'
import {Injectable} from '../../function-injector/Injectable.decorator'

function setHttpMethodMeta(target: Object, prop: string, descriptor: PropertyDescriptor, method: string, path?: string) {

  Injectable(target, prop)

  const cMeta = getControllerMetadata(target.constructor)

  const mMeta: IControllerMethodMetadata = {
    func: descriptor.value,
    method,
    path: path || prop || '/',
    key: prop,
    plugins: []
  }

  setControllerMethodMetadata(target, prop, mMeta)
  cMeta.methods.push(mMeta)
}

export function Http(target: Object, prop: string, descriptor: PropertyDescriptor) {
  const methodSplit = /^(\w+?)::(.*?)$/
  let [_, method, path] = prop.split(methodSplit)
  if (_) { //当仅存在method或path时
    if (['get', 'post', 'put', 'del', 'head'].includes(_)) {
      method = _
      path = '/'
    } else {
      method = 'get'
      path = _
    }
  }
  setHttpMethodMeta(target, prop, descriptor, method, path)
}

export function HttpMethod(method: string, path?: string) {
  return (target: Object, prop: string, descriptor: PropertyDescriptor) => {
    setHttpMethodMeta(target, prop, descriptor, method, path)
  }
}

export function getControllerMethodMetadata(target: Object, prop: string) {
  return Reflect.getMetadata(METHOD, target, prop)
}

function setControllerMethodMetadata(target: Object, prop: string, meta: IControllerMethodMetadata) {
  return Reflect.defineMetadata(METHOD, meta, target, prop)
}

const methods: any = {};

(function () {
  ['get', 'post', 'put', 'del', 'head']
    .forEach((method: string) => {
      methods[method] = (path?: string) => {
        return HttpMethod(method, path)
      }
    })
})()

export const Get: IHttpMethodFunction = methods.get
export const Post: IHttpMethodFunction = methods.post
export const Put: IHttpMethodFunction = methods.put
export const Del: IHttpMethodFunction = methods.del
export const Head: IHttpMethodFunction = methods.head

