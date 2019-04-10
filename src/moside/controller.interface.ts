import {FunctionInjector} from "../function-injector/function-injector";

export interface ControllerOptions {
  providers?: Array<any>;
  path?: string;
}

export interface IHttpMethodFunction {
  (path?: string): Function
}

export interface IControllerMetadata {
  path: string
  methods: IControllerMethodMetadata[]
  providers: any[]
  injector: FunctionInjector

  [param: string]: any
}

export interface IControllerMethodMetadata {
  func: Function
  method: string
  path: string
  key: string

  [param: string]: any
}
