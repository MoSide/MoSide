import 'reflect-metadata';
import { Parameter } from "./parameter.enum";
export declare function HttpParameter(paramType: Parameter | string): (target: any, propertyKey: string) => void;
export declare const Query: (target: any, propertyKey: string) => void;
export declare const PathParameter: (target: any, propertyKey: string) => void;
export declare const Body: (target: any, propertyKey: string) => void;
