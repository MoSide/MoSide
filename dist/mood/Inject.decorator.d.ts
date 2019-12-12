import 'reflect-metadata'
import { Parameter } from './parameter.enum'

export declare function Inject(method: Parameter, prop: string, defaultValue?: any): (target: Object, propertyKey: string, pIndex: number) => void;
