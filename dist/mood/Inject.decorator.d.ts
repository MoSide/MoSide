import 'reflect-metadata';
import { Parameter } from "./parameter.enum";
export declare function Inject(method: Parameter, prop: string): (target: Object, propertyKey: string, pIndex: number) => void;
