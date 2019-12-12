import { PluginInterface } from '../moon'

export interface ControllerOptions {
  providers?: Array<any>;
  path?: string;
  plugins?: PluginInterface[];
}

export interface IHttpMethodFunction {
  (path?: string): Function;
}

export interface IControllerMetadata {
    path: string;
    methods: IControllerMethodMetadata[];
    plugins: PluginInterface[];
    [param: string]: any;
}
export interface IControllerMethodMetadata {
    func: Function;
    method: string;
    path: string;
    key: string;
    plugins: PluginInterface[];
    [param: string]: any;
}
