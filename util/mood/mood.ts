import {ARRAY_TYPE, PARAMETERS} from './type-decorator'
import {IModelProperty} from './model-property.interface'
import {TypeProvider} from '../interface/type-provider.interface'
import {ControllerFunction} from '../common/controller-function'
import {IParameter} from '../interface/parameter.interface'
import {getSymbolDescription} from '../common/get-symbol-description'

let FALSE = Symbol('false')

export class Mood {
  protected source: Map<string, any>
  protected models: Set<any>

  protected constructor() {
  }

  static create(src: [string, any][], models: Set<any>): Mood {
    const mood = new Mood()
    mood.source = new Map(src)
    mood.models = models
    return mood
  }

  protected static toType(object: any, type: Object) {
    switch (type) {
      case Number:
        return Number(object)
      case Boolean:
        if (typeof object === 'string') {
          if (object === 'true') {
            return true
          } else if (object === 'false') {
            return false
          } else {
            return object
          }
        }
        return Boolean(object)
      case Date:
        return new Date(object)
      case String:
        return object
      default:
        return object
    }
  }

  private static ArrayToType(mIns: any, parameter: IModelProperty, src: any) {
    let type = Reflect.getMetadata(ARRAY_TYPE, mIns, parameter.property)
    if (type) {
      mIns[parameter.property] = []
      for (let i = 0; i < src[parameter.property].length; i++) {
        mIns[parameter.property].push(Mood.toType(src[parameter.property][i], type))
      }
    } else {
      mIns[parameter.property] = src[parameter.property]
    }

  }

  resolve(cFunc: ControllerFunction): { result: boolean, body?: TypeProvider[] } {
    const params = cFunc.getParameters()
    const body: TypeProvider[] = []
    for (let param of params) {
      if (param.spec === true) {
        const ret = this.getParam(param)
        if (ret === FALSE) {
          return {result: false}
        }
        body.push({type: param.target, useValue: ret})
      } else if (this.models.has(param.type)) {
        const ret = this.getParamModels(param)
        if (ret === false) {
          return {result: false}
        }

        body.push({type: ret.constructor, useValue: ret})
      }
    }

    return {result: true, body: body}
  }

  protected getParamModels(param: IParameter) {
    let mIns = new param.type
    const metaKeys: Set<symbol> = Reflect.getMetadata(PARAMETERS, mIns)

    //获取需要的属性
    for (let key of metaKeys) {
      let parameters: IModelProperty[] = Reflect.getMetadata(key, mIns)
      let src = this.source.get(getSymbolDescription(key))

      if (!src) {
        continue
      }

      for (let parameter of parameters) {

        if (src[parameter.property] === undefined) {
          const isRequire = Reflect.getMetadata('parameters:require', mIns, parameter.property)
          if (isRequire === true) {
            return false
          }
          continue
        }

        if (parameter.type === Array && src[parameter.property].length) {
          Mood.ArrayToType(mIns, parameter, src)
        } else {
          mIns[parameter.property] = Mood.toType(src[parameter.property], parameter.type)
        }
      }
    }

    return mIns

  }

  protected getParam(param: IParameter) {
    if (!param.target) {
      param.target = ''
    }
    let pos = param.target.split(':')
    if (this.source.has(pos[0])) {
      let value = this.source.get(pos[0])

      for (let p = 1; p < pos.length; p++) {
        if (value === undefined) {
          break
        }
        value = value[pos[p]]
      }

      if (param.require === true && value === undefined) {
        return FALSE
      }

      let v
      if (value) {
        v = Mood.toType(value, param.type)
      }

      return value !== undefined ? v : null
    }

  }

}