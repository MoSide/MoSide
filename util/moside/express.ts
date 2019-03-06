import {RESPOND} from './symbol'
import {ResMessage} from '../interface/res-message.interface'
import {ControllerFunction} from '../common/controller-function'

export function ResMsg(resMsg: ResMessage[]) {
  return function (target: any, propertyKey: string) {
    if (resMsg) {
      Reflect.defineMetadata(RESPOND, resMsg, target, propertyKey)
    }
  }
}

export function getResMsg(cFunc: ControllerFunction) {
  return cFunc.getMetadata(RESPOND) as ResMessage[]
}

/**
 * Created by yskun on 2017/7/8.
 */
