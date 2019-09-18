import { IModelProperty } from './model-property.interface'
import { TypeProvider } from '../function-injector/type-provider.interface'
import { IParameter } from '../function-injector/parameter.interface'
import { arrayTypeConvector, typeConvector } from './utils'
import { getRequireMetadata } from './require'
import { getArrayTypeMeta } from './mood-decorator'
import { MOOD_PARAMETERS } from './constant'
import { getModelMeta } from './Model.decorator'

const FALSE = Symbol('false')

export class Mood {
  protected source: Map<string, any>

  protected constructor() {
  }

  static create(source: [string, any][]): Mood {
    const mood = new Mood()
    mood.source = new Map(source)
    return mood
  }

  resolve(parameters: IParameter[]): { result: boolean, body?: TypeProvider[] } {
    const body: TypeProvider[] = []
    for (let param of parameters) {
      if (param.spec === true) {
        const ret = this.handleParameter(param)
        if (ret === FALSE) {
          return {result: false}
        }
        body.push({token: param.target, useValue: ret})
      } else {
        if (getModelMeta(param.type)) {
          const ret = this.handleModel(param.type)
          if (ret === FALSE) {
            return {result: false}
          }
          body.push({token: ret.constructor, useValue: ret})
        }
      }
    }

    return {result: true, body: body}
  }

  handleModel(Model: any) {
    const model = new Model()
    const metaKeys: Set<string> = Reflect.getMetadata(MOOD_PARAMETERS, model)

    //获取需要的属性
    for (const key of metaKeys) {
      let parameters: IModelProperty[] = Reflect.getMetadata(key, model)
      const source = this.source.get(key)

      if (!source) {
        return FALSE
      }

      const result = parameters.findIndex(({property, type}) => {
        if (source[property] === undefined) {
          return getRequireMetadata(model, property)
        }

        if (type === Array && source[property].length) {
          const arrType = getArrayTypeMeta(model, property)
          if (arrType) {
            model[property] = arrayTypeConvector(source[property], arrType)
          } else {
            model[property] = source[property]
          }
        } else {
          model[property] = typeConvector(source[property], type)
        }

        return false
      })

      if (result > -1) {
        return FALSE
      }
    }

    return model
  }

  handleParameter({target, require, type}: IParameter) {
    if (!target) {
      target = ''
    }
    let pos = target.split('.')
    const source = pos.shift()
    let value

    if (this.source.has(source)) {
      value = this.source.get(source)

      pos.find(p => {
        if (value === undefined) {
          return true
        }
        value = value[p]
      })
    }

    if (require && value === undefined) {
      return FALSE
    }

    if (value !== undefined) {
      if (type === Array) {
        //todo 增加数组的处理
      } else {
        value = typeConvector(value, type)
      }
    }

    return value !== undefined ? value : null
  }

}
