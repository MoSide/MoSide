import {_TypeDecorator} from './type-decorator'

export const QUERY = Symbol('query')
export const PARAMS = Symbol('params')
export const BODY = Symbol('body')

export let Query = _TypeDecorator(QUERY)
export let Params = _TypeDecorator(PARAMS)
export let Body = _TypeDecorator(BODY)

